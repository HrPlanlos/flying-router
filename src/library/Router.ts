import {
  pathToRegexp
} from 'path-to-regexp';

export default class Router<REQ = Request, RES = Response> {
  private _routers: Map<RegExp, Router>;
  private _paths: Array<string>;
  private _regexpPaths: Array<RegExp>;

  constructor() {
    this._routers = new Map();
    this._paths = new Array();
    this._regexpPaths = new Array();
  }

  public use(path: string, router: Router): void {
    const regexpPath = pathToRegexp(path);

    this.addPath(path, regexpPath);

    this._routers.set(regexpPath, router);
  }

  public get(path: string, handler: (req: REQ) => RES) {

  }

  private addPath(path: string, regexpPath: RegExp): void {
    this._paths.push(path);
    this._regexpPaths.push(regexpPath);
  }
}
