const {defaults} = require('jest-config');

module.exports = {
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    'ts',
  ],

  testMatch: [
    '**/tests/**/*.test.js',
  ],

  transform: {
    // '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
  },

  verbose: true,
};
