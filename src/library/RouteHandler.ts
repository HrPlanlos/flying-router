import HTTPMethods from "./enums/HTTPMethods";
import Request from './Request';

type RouteHandler<REQ, RES> = (req: Request<REQ>, res: RES) => void;

export interface Route<REQ, RES> {
  method: HTTPMethods,
  handler: RouteHandler<REQ, RES>,
  path: string,
  pathRegExp: RegExp,
  fullPath: string
}

export default RouteHandler;