var exec = require('cordova/exec'),
  channel = require('cordova/channel'),

  // Reference name for the plugin
  PLUGIN_NAME = 'HotCodePush',

  // Plugin methods on the native side that can be called from JavaScript
  pluginNativeMethod = {
    INITIALIZE: 'jsInitPlugin',
    FETCH_UPDATE: 'jsFetchUpdate',
    INSTALL_UPDATE: 'jsInstallUpdate',
    CONFIGURE: 'jsConfigure',
    REQUEST_APP_UPDATE: 'jsRequestAppUpdate'
  };

// Called when Cordova is ready for work.
// Here we will send default callback to the native side through which it will send to us different events.
channel.onCordovaReady.subscribe(function() {

  //exec(nativeCallback, null, PLUGIN_NAME, pluginNativeMethod.INITIALIZE, []);
});

/**
 * Method is called when native side sends us different events.
 * Those events can be about update download/installation process.
 *
 * @param {String} msg - JSON formatted string with call arguments
 */
function nativeCallback(msg) {

}

var chcpLocalDev = {
  
};

module.exports = chcpLocalDev;
