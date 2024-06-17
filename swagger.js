import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'My API Description',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./index.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;