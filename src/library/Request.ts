export default interface Request<REQ> {
  org: REQ,
  params: {[k: string]: string},
  query: () => {[k: string]: string}
}

exports.default = Request;
module.exports = Request;