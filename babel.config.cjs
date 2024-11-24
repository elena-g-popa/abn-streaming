module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "> 0.25%, not dead", // or any relevant target configuration
        modules: "auto" // This will help Jest handle ES Modules
      }
    ]
  ]
};
