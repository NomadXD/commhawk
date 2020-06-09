//require("appmetrics-dash").attach();
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
        openapi: "3.0.1",
        title: "User API",
        description: "User API Information",
        contact: {
          name: "Commhawk"
        }
      },
      
    },
    apis: ["src/service.routes.js"]
  };

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


module.exports = app;