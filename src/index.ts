import { Request, Route, Options } from "FlyingRouter";
import HTTPMethods from "./library/enums/HTTPMethods";
import Router from "./library/Router";
import { pathToRegexp, match } from "path-to-regexp";

export default class FlyingRouter<REQ, RES> extends Router<REQ, RES> {
  private map: Map<RegExp, Route<REQ, RES>> = new Map();
  private _options: Options<REQ, RES>;

  constructor(options?: Options<REQ, RES>) {
    super();
    this._options = options || {};
  }

  public handle(req: REQ, res: RES, method: HTTPMethods|null, url: string) {
    let split = url.split(/\?/);
    url = split[0];
    let newReq: Request<REQ> = {
      org: req,
      params: {},
      query: () => {
        let query: {[k: string]: string} = {};
        //Parsing Query parameters
        let queryParameters = split[1]?.split(/&/g);

        if(query) {
          for(let param in queryParameters) {
            let temp = queryParameters[param].split(/=/);
            query[temp[0]||""] = temp[1]||"";
          }
        }

        return query;
      }
    };

    for (const [pathRegExp, routeObj] of this.map.entries()) {
      if (routeObj.method === method && pathRegExp.exec(url)) {
        let params = match(routeObj.fullPath, { decode: decodeURIComponent });
        newReq.params = (params(url) as any).params;

        routeObj.handler(newReq, res);

        return;
      }
    }

    if (this._options.noMatchResponse != undefined) {
      this._options.noMatchResponse(newReq, res);
    } else {
      throw new Error("Couldn't find any route or no match response!");
    }
  }

  public calcRoutes() {
    let returnMap: Map<RegExp, Route<REQ, RES>> = new Map();

    for(const [path, routeObj] of this.calcRoutesForRouter(this)) {
      returnMap.set(pathToRegexp(path), routeObj);
      routeObj.fullPath = path;
    }

    this.map = returnMap;
  }

  private calcRoutesForRouter(root: Router<REQ, RES>, parentPath?: string): Map<string, Route<REQ, RES>> {
    let routes: Map<string, Route<REQ, RES>> = new Map();

    if(!parentPath) {
      for(let handler of root.handlers) {
        routes.set(this.removeMultipleSlash(`${root.path}${handler[0]}`), handler[1]);
      }
    }

    for(let router of root.routers) {
      let path = router.path;

      if(router.routers.length > 0) {
        for(let route of this.calcRoutesForRouter(router, path)) {
          routes.set(this.removeMultipleSlash(route[0]), route[1]);
        }
      }

      for(let handler of router.handlers) {
        routes.set(this.removeMultipleSlash(`${parentPath||""}${path}${handler[0]}`), handler[1]);
      }
    }

    return routes;
  }

  private removeMultipleSlash(path: string): string {
    let lastChar: string = "";
    let finalString: string = "";

    for(let s of path) {
      if(!(lastChar === "/" && s === "/")) {
        finalString = finalString.concat(s);
      }

      lastChar = s;
    }

    return finalString;
  }
}

module.exports = FlyingRouter;
module.exports.router = require('./library/Router');
module.exports.HTTPMethods = require('./library/enums/HTTPMethods');