const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  injectBabelPlugin(['@babel/plugin-proposal-decorators', { legacy: true }], config);
  injectBabelPlugin('babel-plugin-styled-components', config);
  return config;
}
