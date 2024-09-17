 
  module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "\\.(css|less|scss)$": "<rootDir>/src/__mocks__/styleMock.js"
    }
  };
  