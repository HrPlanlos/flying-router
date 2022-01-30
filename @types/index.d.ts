declare module "FlyingRouter" {
  type RouteHandler<REQ, RES> = (req: FlyingRequest<REQ>, res: RES) => void;

  interface Options {
    noMatchResponse?: RouteHandler<REQ, RES>
  }

  interface Route<REQ, RES> {
    method: import ("../src/library/enums/HTTPMethods"),
    handler: RouteHandler<REQ, RES>,
    path: string,
    pathRegExp: RegExp,
    fullPath: string
  }

  interface Request<REQ> {
    org: REQ,
    params: {[k: string]: string},
    query: () => {[k: string]: string}
  }
}
