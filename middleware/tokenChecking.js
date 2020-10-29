const utils = require("../utils");

module.exports.tokenChecking = (request, response, next) => {
  const { token } = request.headers;

  try {
    utils.verifyToken(token);
  } catch (err) {
    return response.status(403).send("Token must be provided");
  }

  return next();
};
