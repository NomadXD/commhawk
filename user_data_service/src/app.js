const express = require("express");
const app = express();
const userRouter = require("./service.routes");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/user",userRouter);

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "User API",
        description: "User API Information",
        contact: {
          name: "Amazing Developer"
        },
        servers: ["http://localhost:3000"]
      }
    },
    // ['.routes/*.js']
    apis: ["service.routes.js"]
  };

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/user/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


module.exports = app;