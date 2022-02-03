import HTTPMethods from "./library/enums/HTTPMethods";
import router from "./library/Router";
import { pathToRegexp, match } from "path-to-regexp";
import routeHandler, { Route as route } from "./library/RouteHandler";
import Req from "./library/Request";

export default class FlyingRouter<REQ, RES> extends router<REQ, RES> {
  private map: Map<RegExp, route<REQ, RES>> = new Map();
  private _options: Options<REQ, RES>;

  constructor(options?: Options<REQ, RES>) {
    super();
    this._options = options || {};
  }

  public handle(req: REQ, res: RES, method: string, url: string) {
    let split = url.split(/\?/);
    url = split[0];
    let newReq: Req<REQ> = {
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
      if (routeObj.method === this.methodFromString(method) && pathRegExp.exec(url)) {
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
    let returnMap: Map<RegExp, route<REQ, RES>> = new Map();

    for(const [path, routeObj] of this.calcRoutesForRouter(this)) {
      returnMap.set(pathToRegexp(path), routeObj);
      routeObj.fullPath = path;
    }

    this.map = returnMap;
  }

  private calcRoutesForRouter(root: router<REQ, RES>, parentPath?: string): Map<string, route<REQ, RES>> {
    let routes: Map<string, route<REQ, RES>> = new Map();

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

  private methodFromString(str: any): HTTPMethods | null {
    switch(str) {
      case 'GET': return HTTPMethods.GET;
      case 'PUT': return HTTPMethods.PUT;
      case 'POST': return HTTPMethods.POST;
      case 'PATCH': return HTTPMethods.PATCH;
      case 'DELETE': return HTTPMethods.DELETE;
      default: return null;
    }
  }
}

export interface Options<REQ, RES> {
  noMatchResponse?: routeHandler<REQ, RES>
}

exports.default = FlyingRouter;
module.exports = FlyingRouter;

export const Router = router;
exports.Router = router;
module.exports.Router = router;

export type Request<REQ> = Req<REQ>;
export type RouteHandler<REQ, RES> = routeHandler<REQ, RES>;
export type Route<REQ, RES> = route<REQ, RES>;

export const httpMethods = HTTPMethods;
exports.httpMethods = HTTPMethods;
module.exports.httpMethods = HTTPMethods;