import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ecommerce",
      version: "1.0.0",
      description: "API documentation example",
    },
    servers: [
      { url: "http://localhost:3000" },
    ],
  },
  apis: ["./src/routes/public/*.js", "./src/routes/protected/*.js", "./src/routes/private/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app, port) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
};
