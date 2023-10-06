const routes = require("express").Router();
const authMiddleware = require("./app/middlewares/authentication");
const AdminMiddleware = require("./app/middlewares/admin");
const AuthorizationMiddleware = require("./app/middlewares/authorization");
const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");
const ProductController = require("./app/controllers/ProductController");
const CustomerController = require("./app/controllers/CustomerController");
const FinancialController = require("./app/controllers/FinancialController");

//Public Routes
//Users
routes.post("/signup", UserController.store);
//Session
routes.post("/sessions", SessionController.login);

//Logged Routes
routes.use(authMiddleware);

//Products
routes.get("/products", ProductController.get);
routes.get("/products/:id", ProductController.show);
routes.post("/products", ProductController.store);
routes.patch("/products/:id", ProductController.update);
routes.delete("/products/:id", ProductController.delete);

//Customers
routes.get("/customers", CustomerController.get);
routes.get("/customers/:id", CustomerController.show);
routes.post("/customers", CustomerController.store);
routes.patch("/customers/:id", CustomerController.update);
routes.delete("/customers/:id", CustomerController.delete);

//Financial
routes.post("/financial/sell", FinancialController.sell);
routes.post("/financial/buy", FinancialController.buy);
routes.get("/financial/buy-report", FinancialController.buyReport);
routes.get(
  "/financial/users/:id/buy-report",
  FinancialController.userBuyReport
);
routes.get("/financial/sell-report", FinancialController.sellReport);
routes.get(
  "/financial/users/:id/sell-report",
  AuthorizationMiddleware,
  FinancialController.userSellReport
);

//Users or Admin Private Routes
routes.use(AuthorizationMiddleware);
//Users
routes.get("/users/:id", AuthorizationMiddleware, UserController.show);
routes.patch("/users/:id", AuthorizationMiddleware, UserController.update);

//Financial
routes.get(
  "/financial/fiscal/orders/:id",
  AuthorizationMiddleware,
  FinancialController.fiscal
);

//Admin Private Routes
routes.use(AdminMiddleware);
//Users
routes.get("/users", UserController.get);
routes.delete("/users/:id", UserController.delete);

//Financial
routes.get(
  "/financial/users/:id/buy-report",
  FinancialController.userBuyReport
);
routes.get(
  "/financial/users/:id/sell-report",
  AuthorizationMiddleware,
  FinancialController.userSellReport
);

module.exports = routes;
