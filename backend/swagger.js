const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MVP Task Collaboration Platform API',
      version: '1.0.0',
      description: 'A comprehensive task management and collaboration platform API',
      contact: {
        name: 'API Support',
        email: 'support@taskplatform.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5002',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Complete project documentation' },
            description: { type: 'string', example: 'Write comprehensive API documentation' },
            status: { type: 'string', enum: ['Todo', 'In Progress', 'Done'], example: 'Todo' },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'], example: 'High' },
            createdBy: { type: 'integer', example: 1 },
            assignedTo: { type: 'integer', example: 2 },
            creatorName: { type: 'string', example: 'John Doe' },
            assigneeName: { type: 'string', example: 'Jane Smith' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            taskId: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            content: { type: 'string', example: 'This task is progressing well' },
            userName: { type: 'string', example: 'John Doe' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Activity: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            type: { type: 'string', example: 'task_created' },
            description: { type: 'string', example: 'John Doe created task "Complete documentation"' },
            userId: { type: 'integer', example: 1 },
            taskId: { type: 'integer', example: 1 },
            userName: { type: 'string', example: 'John Doe' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error message' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = { swaggerUi, specs };