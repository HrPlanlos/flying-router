//TODO: Re-Implement Router

import { Route, RouteHandler } from "FlyingRouter";
import HTTPMethods from "./enums/HTTPMethods";
import { pathToRegexp } from "path-to-regexp";

export default class Router<REQ, RES> {
  private _path: string = "";
  readonly routers: Array<Router<REQ, RES>> = new Array();
  readonly handlers: Map<string, Route<REQ, RES>> = new Map();

  public get path(): string {
    return this._path;
  }

  public use(path: string, router: Router<REQ, RES>)  {
    router._path = path;
    this.routers.push(router);
  }

  public get(path: string, handler: RouteHandler<REQ, RES>) {
    this.addHandler(path, HTTPMethods.GET, handler);
  }

  public put(path: string, handler: RouteHandler<REQ, RES>) {
    this.addHandler(path, HTTPMethods.PUT, handler);
  }

  public post(path: string, handler: RouteHandler<REQ, RES>) {
    this.addHandler(path, HTTPMethods.POST, handler);
  }

  public delete(path: string, handler: RouteHandler<REQ, RES>) {
    this.addHandler(path, HTTPMethods.DELETE, handler);
  }

  public patch(path: string, handler: RouteHandler<REQ, RES>) {
    this.addHandler(path, HTTPMethods.PATCH, handler);
  }

  private addHandler(path: string, method: HTTPMethods, handler: RouteHandler<REQ, RES>) {    
    this.handlers.set(path, {
      handler: handler,
      method: method,
      path: path,
      pathRegExp: pathToRegexp(path),
      fullPath: ""
    });
  }
}

module.exports = Router;