/*
When plugin is removed from the project - we need to deactivate Swift support.
This hook does that.
*/
var swiftHelper = require('./lib/swiftHelper.js'),
  logger = require('./lib/logger.js');

module.exports = function(ctx) {
  logger.header('CHCP Local Dev plugin cleanup:');
  swiftHelper.disable(ctx);
};
