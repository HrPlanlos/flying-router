import { Request, Route, Options } from "FlyingRouter";

export default class FlyingRouter<REQ, RES> {
  private map: Map<RegExp, Route<REQ, RES>> = new Map();
  private _options: Options;

  constructor(options?: Options) {
    this._options = options || {};
  }

  public handle(req: REQ, res: RES, method: string, url: string) {
    let newReq: Request<REQ> = {
      org: req,
      params: {},
      query: () => {
        let query: {[k: string]: string} = {};
        //Parsing Query parameters
        //TODO: Improve
        url
          .split(/\?/)[1]
          ?.split(/&/g)
          .forEach((qp) => {
            let split = qp.split(/=/);
    
            query[split[0]||""] = split[1]||"";
          });

        return query;
      }
    };

    for (const [k, v] of this.map.entries()) {
      if (v.method === method && k.exec(url)) {
        newReq.params = {};

        v.handler(newReq, res);

        return;
      }
    }

    if (this._options.noMatchResponse != undefined) {
      this._options.noMatchResponse(newReq, res);
    } else {
      throw new Error("Couldn't find any route or no match response!");
    }
  }

  //TODO: Implement recursive path calculation
}
