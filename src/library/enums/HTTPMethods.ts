enum HTTPMethods {
  GET,
  PUT,
  POST,
  PATCH,
  DELETE
}

export function methodFromString(str: any): HTTPMethods | null {
  switch(str) {
    case 'GET': return HTTPMethods.GET;
    case 'PUT': return HTTPMethods.PUT;
    case 'POST': return HTTPMethods.POST;
    case 'PATCH': return HTTPMethods.PATCH;
    case 'DELETE': return HTTPMethods.DELETE;
    default: return null;
  }
}

export default HTTPMethods;
exports.default = HTTPMethods;
module.exports = HTTPMethods;

export const getMethodFromString = methodFromString;
exports.getMethodFromString = methodFromString;
module.exports.getMethodFromString = methodFromString;