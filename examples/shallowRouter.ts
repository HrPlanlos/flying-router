import { methodFromString } from "../src/library/enums/HTTPMethods";
import { Options, Request } from "FlyingRouter";

let options: Options = {
  noMatchResponse: (req: Request<string>, res: string) => {
    
  }
}