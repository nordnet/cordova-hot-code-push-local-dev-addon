var exec = require('cordova/exec'),
  channel = require('cordova/channel'),

  // Reference name for the plugin
  PLUGIN_NAME = 'HotCodePushLocalDevMode',

  // Plugin methods on the native side that can be called from JavaScript
  pluginNativeMethod = {
    INITIALIZE: 'jsInitPlugin'
  };

// Called when Cordova is ready for work.
// Here we will send default callback to the native side through which it will send to us different events.
channel.onCordovaReady.subscribe(function() {
  exec(nativeCallback, null, PLUGIN_NAME, pluginNativeMethod.INITIALIZE, []);
});

/**
 * Method is called when native side detects new release and need to trigger the update.
 *
 * @param {String} message from the native side
 */
function nativeCallback(msg) {
  chcp.fetchUpdate();
}
