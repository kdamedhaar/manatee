import express, { urlencoded, json } from "express";
import { slackapi } from "./routes";
import { handleErrors } from "./middlewares";
var winston = require("./config/winston");
const morgan = require("morgan");
require("dotenv").load();

/*-----------------------------------
    Build the Express app
  -----------------------------------*/
const app = express();

// Logging with morgan and winston
// app.use(morgan('dev'));
app.use(morgan("combined", { stream: winston.stream }));
// app.use(winston_logger);

// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// parse application/json
app.use(json());

// configure CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

/*-----------------------------------
    Routes
  -----------------------------------*/
app.use("/", slackapi);
app.use(handleErrors);

/*-----------------------------------
    Start the server
  -----------------------------------*/
const server = app.listen(process.env.PORT || 4040, () => {
  winston.info(`Server started on Port ${process.env.PORT || 4040}`);
  // console.log(`Server started on Port ${process.env.PORT || 4040}`);
});
