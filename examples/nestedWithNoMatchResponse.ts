import FlyingRouter from "../src";
import Router from "../src/library/Router";

import http, { IncomingMessage, ServerResponse } from "http";
import { methodFromString } from "../src/library/enums/HTTPMethods";
import { Options, Request } from "FlyingRouter";

let options: Options = {
  noMatchResponse: (req: Request<IncomingMessage>, res: ServerResponse) => {
    res.statusCode = 404;
    res.statusMessage = "Not Found";
    res.write("Page not Found");
    res.end();
  },
};
let flyingRouter: FlyingRouter<IncomingMessage, ServerResponse> =
  new FlyingRouter(options);

let r1: Router<Request<IncomingMessage>, ServerResponse> = new Router();
let r2: Router<Request<IncomingMessage>, ServerResponse> = new Router();

flyingRouter.get("/hello", (req, res) => { res.write("hello"); res.end(); });
flyingRouter.use("/:userid", r1);

r1.get("/user", (req, res) => { res.write("user"); res.end(); });
r1.use("/security", r2);

// /:userid/security/:param
r2.get("/:param", (req: Request<IncomingMessage>, res) => {
  let str = "Params:\n";
  for (let el in req.params) {
    str = str.concat(`- ${el}: ${req.params[el]}\n`);
  }
  str = str.concat("Query-Params:\n");
  for (let el in req.query()) {
    str = str.concat(`- ${el}: ${req.query()[el]}\n`);
  }

  res.write(str);
  res.end();
});

flyingRouter.calcRoutes();

http
  .createServer((req, res) => {
    flyingRouter.handle(req, res, methodFromString(req.method), req.url || "/");
  })
  .listen(80);
