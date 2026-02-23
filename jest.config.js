export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/services/fabricNetwork.js',
    '!backend/services/websocket.js',
    '!backend/services/demoData.js',
    '!backend/server.js'
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  testTimeout: 10000,
  verbose: true
};