import { pathToRegexp } from "path-to-regexp";
import Router from "./library/Router";

export default class FlyingRouter {
  private _routers: Map<RegExp, Router>;
  private _options: Options;

  constructor(options? : Options) {
    this._routers = new Map();
    this._options = options || {};
  }

  public use(path: string, router: Router): void {
    const regexPath = pathToRegexp(path);

    this._routers.set(regexPath, router);
  }
}
