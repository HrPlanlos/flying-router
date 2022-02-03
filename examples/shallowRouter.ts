// TODO: Add example

import { Options } from '../src';
import Request from '../src/library/Request';

let options: Options<string, string> = {
  noMatchResponse: (req: Request<string>, res: string): void => {
    res = req.org.toUpperCase();
  },
}