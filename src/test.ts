console.time("test.ts");
import FlyingRouter from "./";
import Router from "./library/Router";

import http, { IncomingMessage, ServerResponse } from 'http';
import { methodFromString } from "./library/enums/HTTPMethods";
import { Options, Request } from "FlyingRouter";

let options: Options = {
  noMatchResponse: (req: Request<IncomingMessage>, res: ServerResponse) => {
    res.statusCode = 404;
    res.statusMessage = "Not Found";
    res.write("Page not Found");
    res.end();
  }
}
let flyingRouter: FlyingRouter<IncomingMessage, ServerResponse> = new FlyingRouter(options);

let r1: Router<Request<IncomingMessage>, ServerResponse> = new Router();
let r2: Router<Request<IncomingMessage>, ServerResponse> = new Router();

flyingRouter.get("/hello", (req, res) => {res.write("hello");res.end();});
flyingRouter.get("/", (req, res) => {res.write("root");res.end();});
flyingRouter.use("/:userid", r1);

r1.get("/user", (req, res) => {res.write("user");res.end();});
r1.get("/", (req, res) => {res.write("userid");res.end();});
r1.get("/hduioaw", (req, res) => {res.write("hduioaw");res.end();});
r1.use("/security", r2);

r2.get("/test", (req, res) => {res.write("test");res.end();});
r2.get("/a", (req, res) => {res.write("security");res.end();});

flyingRouter.calcRoutes();
console.timeEnd("test.ts");

http.createServer((req, res) => {console.time("handle");flyingRouter.handle(req, res, methodFromString(req.method), req.url||'/');console.timeEnd("handle");}).listen(80);
