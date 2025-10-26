// Quick test to verify the serverless function works
const serverless = require("serverless-http");
const app = require("./server.js");

const handler = serverless(app);

// Simulate a request
const mockEvent = {
  httpMethod: 'GET',
  path: '/mcp',
  headers: {},
  queryStringParameters: null,
  body: null
};

const mockContext = {};

handler(mockEvent, mockContext, (err, result) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Success!');
    console.log('Status Code:', result.statusCode);
    console.log('Body:', result.body);
  }
});
