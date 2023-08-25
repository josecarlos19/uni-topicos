const routes = require("express").Router();
const authMiddleware = require("./app/middlewares/authentication");
const AdminMiddleware = require("./app/middlewares/admin");
const AuthorizationMiddleware = require("./app/middlewares/authorization");
const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");
const ProductController = require("./app/controllers/ProductController");
const FinancialController = require("./app/controllers/FinancialController");
const EmployeesController = require("./app/controllers/EmployeesController");
const TimeSheetController = require("./app/controllers/TimeSheetController");

//Public Routes
//Users
routes.post("/register", UserController.store);
//Session
routes.post("/sessions", SessionController.login);

//Logged Routes
routes.use(authMiddleware);
//Products
routes.get("/products", ProductController.get);
routes.get("/products/:id", ProductController.show);
//Financial
routes.post("/financial/sell", FinancialController.sell);
//TimeSheet
routes.post("/timesheet", TimeSheetController.store);

//Users or Admin Private Routes
routes.use(AuthorizationMiddleware);
//Users
routes.get("/users/:id", AuthorizationMiddleware, UserController.show);
routes.patch("/users/:id", AuthorizationMiddleware, UserController.update);
//Employees
routes.get("/employees/:id", AuthorizationMiddleware, EmployeesController.show);
routes.patch(
  "/employees/:id",
  AuthorizationMiddleware,
  EmployeesController.update
);
//Financial
routes.get(
  "/financial/fiscal/orders/:id",
  AuthorizationMiddleware,
  FinancialController.fiscal
);
routes.get(
  "/financial/users/:id/sell-report",
  AuthorizationMiddleware,
  FinancialController.userSellReport
);
//TimeSheet
routes.get(
  "/timesheet/employees/:id",
  AuthorizationMiddleware,
  TimeSheetController.get
);

//Admin Private Routes
routes.use(AdminMiddleware);
//Users
routes.get("/users", UserController.get);
routes.delete("/users/:id", UserController.delete);

//Employees
routes.post("/employees", EmployeesController.store);
routes.get("/employees", EmployeesController.get);

//Products
routes.post("/products", ProductController.store);
routes.patch("/products/:id", ProductController.update);
routes.delete("/products/:id", ProductController.delete);

//Financial
routes.post("/financial/buy", FinancialController.buy);
routes.get("/financial/buy-report", FinancialController.buyReport);
routes.get(
  "/financial/users/:id/buy-report",
  FinancialController.userBuyReport
);
routes.get("/financial/sell-report", FinancialController.sellReport);

module.exports = routes;
