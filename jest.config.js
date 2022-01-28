/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */


module.exports = {
  transform: {
    "^.+\\.tsx?$": [
      "esbuild-jest",
      {
        sourcemap: true,
        loaders: {
          '.spec.ts': 'tsx'
        }
      }
    ]
  },

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
