const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StepZone API",
      version: "1.0.0",
      description: "StepZone Ecommerce API Documentation"
    },
    
    servers: [
      {
        url: "http://localhost:5000"
      },
            {
        url: "http://localhost:8000"
      }
    ]
  },

  apis: ["./routes/*.js"] // swagger routes read cheyyum
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;