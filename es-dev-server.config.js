const { mdjsTransformer } = require("@mdjs/core");

module.exports = {
  nodeResolve: true,
  // open: "node_modules/@lion/tabs/README.md",
  watch: true,
  babel: true,
  plugins: [mdjsTransformer],
};
