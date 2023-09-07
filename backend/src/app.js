const express = require("express");
const knexfile = require("../knexfile");
const cors = require("cors");
require("dotenv").config();
// need to add frontend url to cors
class AppController {
  constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());

    const allowedOrigins = ["http://localhost:3001"];

    const corsOptions = {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    };

    this.express.use(cors(corsOptions));
  }

  routes() {
    this.express.use(require("./routes"));
  }
}

module.exports = new AppController().express;
