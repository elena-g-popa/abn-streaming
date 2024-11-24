module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.vue$": ["@vue/vue3-jest", { "compilerOptions": { "preserveWhitespace": false } }],
    "^.+\\.js$": "babel-jest",
    "^.+\\.html$": "jest-raw-loader", // Add this line for external HTML templates
    "^.+\\.scss$": "jest-scss-transform", // Transform SCSS files using jest-scss-transform
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts|vue)$", // Support Vue file extensions in tests
  moduleFileExtensions: ["vue", "js", "ts", "json", "scss"], // Add SCSS to extensions
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.html$": "<rootDir>/src/__mocks__/raw-html-mock.js", // Mock HTML files
    "\\.scss$": "<rootDir>/src/__mocks__/style-mock.js", // Mock SCSS files
    "\\.(png|jpe?g|gif|svg)$": "<rootDir>/src/__mocks__/assets-mock.js", // Mock image files


  },
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  coverageReporters: ["text", "json-summary"],
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  transformIgnorePatterns: ["/node_modules/(?!(@vue|@babel/runtime)/)"],
};
