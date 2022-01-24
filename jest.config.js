/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */


module.exports = {
  moduleFileExtensions: [
    "js", // has to be here for Jest to pick up jest.config.js
    "ts",
  ],

  roots: [
    "./src"
  ],
  testMatch: [
    "**/?(*.)+(test).ts"
  ],

  testPathIgnorePatterns: [
    "/node_modules/"
  ],
};
