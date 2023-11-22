const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const knexC = require("knex");
const config = require("../../../knexfile");
const env = process.env.NODE_ENV || "development";
const knex = knexC(config[env]);

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token not provided" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decodedUser = await promisify(jwt.verify)(
      token,
      process.env.APP_SECRET
    );

    req.userId = decodedUser.id;
    req.userRoles = decodedUser.roles;

    const validUser = await knex
      .select("id")
      .from("users")
      .where("id", decodedUser.id)
      .first();

    if (!validUser.id) {
      return res.status(401).json({ message: "Token invalid" });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid", err });
  }

  // eslint-disable-next-line no-unreachable
  return next();
};
