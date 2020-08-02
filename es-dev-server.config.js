const { mdjsTransformer } = require('@mdjs/core');

module.exports = {
  nodeResolve: true,
  watch: true,
  responseTransformers: [mdjsTransformer],
};
