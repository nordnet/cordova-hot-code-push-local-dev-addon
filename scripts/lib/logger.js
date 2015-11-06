/*
Small logger for plugin hooks.
*/

(function() {

  var colors = require('colors/safe'),
    MESSAGES_PREFIX = '    ';

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
    console.log(colors.underline(msg));
  }

  /**
   * Print informational message.
   * Message will have prefix with empty spaces.
   *
   * @param {String} msg - message to print
   */
  function info(msg) {
    console.log(formatMessage(msg));
  }

  /**
   * Print error message.
   *
   * @param {String} msg - message to print
   */
  function error(msg) {
    var formattedMsg = formatMessage(msg),
      coloredMsg = colors.red(formatMessage);

    console.log(coloredMsg);
  }

  /**
   * Print warning message.
   *
   * @param {String} msg - message to print
   */
  function warn(msg) {
    var formattedMsg = formatMessage(msg),
      coloredMsg = colors.yellow(formattedMsg);

    console.log(coloredMsg);
  }

  /**
   * Print success message.
   *
   * @param {String} msg - message to print
   */
  function success(msg) {
    var formattedMsg = formatMessage(msg),
      coloredMsg = colors.green(formattedMsg);

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

})();
