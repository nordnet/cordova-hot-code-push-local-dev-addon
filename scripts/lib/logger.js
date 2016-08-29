/*
Small logger for plugin hooks.
*/

var colors = require('colors');
var MESSAGES_PREFIX = '    ';

module.exports = {
  header: header,
  info: info,
  warn: warn,
  error: error,
  success: success
};

// region Public API

/**
 * Print header.
 *
 * @param {String} msg - header message
 */
function header(msg) {
  var message = colors.underline(msg);
  console.log(message);
}

/**
 * Print informational message.
 * Message will have prefix with empty spaces.
 *
 * @param {String} msg - message to print
 */
function info(msg) {
  var message = formatMessage(msg);
  console.log(message);
}

/**
 * Print error message.
 *
 * @param {String} msg - message to print
 */
function error(msg) {
  var message = formatMessage(msg),
    coloredMsg = colors.red(message);

  console.log(coloredMsg);
}

/**
 * Print warning message.
 *
 * @param {String} msg - message to print
 */
function warn(msg) {
  var message = formatMessage(msg),
    coloredMsg = colors.yellow(message);

  console.log(coloredMsg);
}

/**
 * Print success message.
 *
 * @param {String} msg - message to print
 */
function success(msg) {
  var message = formatMessage(msg),
    coloredMsg = colors.green(message);

  console.log(coloredMsg);
}

// endregion

// region Private API

/**
 * Format message before printing it to console.
 *
 * @param {String} msg - unformatted message
 * @return {String} formatted message
 */
function formatMessage(msg) {
  return MESSAGES_PREFIX + msg;
}

// endregion
