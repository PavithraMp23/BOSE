const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BOSE Backend API',
      version: '1.0.0',
      description: 'Admin and Identity APIs for BOSE'
    },
    servers: [
      {
        url: 'http://localhost:3002'
      }
    ]
  },
  apis: ['./routes/**/*.js'], // 👈 auto-detect routes
};

module.exports = swaggerJSDoc(options);
