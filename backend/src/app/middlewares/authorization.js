const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const knexC = require("knex");
const config = require("../../../knexfile");
const knex = knexC(config.development);

module.exports = async (req, res, next) => {
  if (req.params.id) {
    let currentUserRoles;
    if (req.userId) {
      currentUserRoles = await knex("users")
        .select("roles")
        .where("id", req.userId)
        .first();

      if (currentUserRoles && currentUserRoles.roles) {
        currentUserRoles = JSON.parse(currentUserRoles.roles);
      }
      const isAdmin =
        Array.isArray(currentUserRoles) && currentUserRoles.includes("admin");

      const isAnUsersRoute = req.originalUrl.includes("/users");
      const isAnEmployeesRoute = req.originalUrl.includes("/employees");
      const isAnOrdersRoute = req.originalUrl.includes("/orders");
      const requestId = req.params.id ? +req.params.id : null;
      const loggedUser = req.userId ? +req.userId : null;

      if (isAnUsersRoute) {
        if (isAdmin || requestId === loggedUser) {
          return next();
        } else {
          return res.status(403).json({ message: "You are not allowed to" });
        }
      } else if (isAnEmployeesRoute) {
        if (requestId !== loggedUser && !isAdmin) {
          return res.status(403).json({ message: "You are not allowed to" });
        }

        const foundEmployee = await knex("employees")
          .select("user_id")
          .where("user_id", requestId)
          .first();

        if (!foundEmployee && !isAdmin) {
          return res.status(404).json({ message: "Employee not found" });
        }

        if (isAdmin || foundEmployee.user_id === req.userId) {
          return next();
        } else {
          return res.status(403).json({ message: "You are not allowed to" });
        }
      } else if (isAnOrdersRoute) {
        const orderId = req.params.id ? +req.params.id : null;
        const foundOrder = await knex("orders")
          .select("user_id")
          .where("id", orderId)
          .first();

        if (!foundOrder && !isAdmin) {
          return res.status(404).json({ message: "Order not found" });
        } else if (
          foundOrder &&
          foundOrder.user_id !== loggedUser &&
          !isAdmin
        ) {
          return res.status(403).json({ message: "You are not allowed to" });
        } else if (!foundOrder && isAdmin) {
          return res.status(404).json({ message: "Order not found" });
        }

        if (isAdmin || foundOrder.user_id === loggedUser) {
          return next();
        } else {
          return res.status(403).json({ message: "You are not allowed to" });
        }
      }
    }
  } else {
    return next();
  }
};
