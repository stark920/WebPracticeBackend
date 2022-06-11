const swaggerDefinition = {
  info: {
    title: 'MetaWall API',
    version: '1.0.0',
    description: 'This is api document',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'headers',
        name: 'authorization',
        description: '請加上 API Token',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

module.exports = swaggerDefinition;
