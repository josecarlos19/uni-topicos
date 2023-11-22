const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const knexC = require("knex");
const config = require("../../../knexfile");
const env = process.env.NODE_ENV || "development";
const knex = knexC(config[env]);

module.exports = async (req, res, next) => {
  let currentUserRoles;
  if (req.userId) {
    currentUserRoles = await knex("users")
      .select("roles")
      .where("id", req.userId)
      .first();

    if (currentUserRoles && currentUserRoles.roles) {
      currentUserRoles = JSON.parse(currentUserRoles.roles);
    }
  }

  if (Array.isArray(currentUserRoles) && currentUserRoles.includes("admin")) {
    return next();
  } else {
    return res.status(403).json({ message: "You are not allowed to" });
  }
};
