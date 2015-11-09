/**
This is an iOS specific hook. It enables Swift support in the project.
Plugin itself is written in Objective-C, but it uses Socket.IO library to connect to local server when we in
local development mode. And that library is written in Swift.
*/

var swiftHelper = require('./lib/swiftHelper.js'),
  logger = require('./lib/logger.js');

module.exports = function(ctx) {
  logger.header('Swift support activation hook:');
  swiftHelper.activate(ctx);
};
