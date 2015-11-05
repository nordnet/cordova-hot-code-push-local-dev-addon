
var fs = require('fs'),
  path = require('path'),
  chcpConfigXmlReader = require('./lib/chcpConfigXmlReader.js'),
  chcpConfigXmlWriter = require('./lib/chcpConfigXmlWriter.js'),
  buildVersionUpdater = require('./lib/buildVersionUpdater.js'),
  HOT_CODE_PUSH_PLUGIN_NAME = 'cordova-hot-code-push-plugin',
  RELEASE_BUILD_FLAG = '--release';

function isChcpPluginInstalled(ctx) {
  var pathToChcpPluginConfig = path.join(ctx.opts.projectRoot, 'plugins', HOT_CODE_PUSH_PLUGIN_NAME, 'plugin.xml'),
    isInstalled = false;
  try {
    var pluginXmlContent = fs.readFileSync(pathToChcpPluginConfig);
    isInstalled = true;
  } catch(err) {
  }

  return isInstalled;
}

function isBuildingForRelease(ctx) {
  var consoleOptions = ctx.opts.options;

  for (var idx in consoleOptions) {
    if (consoleOptions[idx] === RELEASE_BUILD_FLAG) {
      return true;
    }
  }

  return false;
}

function readObjectFromFile(filePath) {
  var objData = null;
  try {
    var data = fs.readFileSync(filePath, 'utf-8');
    objData = JSON.parse(data, 'utf-8');
  } catch (err) {
  }

  return objData;
}

function getLocalServerURLFromEnvironmentConfig(ctx) {
  var chcpEnvFilePath = path.join(ctx.opts.projectRoot, '.chcpenv'),
    envConfig = readObjectFromFile(chcpEnvFilePath);

  if (envConfig) {
    return envConfig.config_url;
  }

  return null;
};

function isExecutionAllowed(ctx) {
  if (!isChcpPluginInstalled(ctx)) {
    printLog('WARNING! Hot Code Push plugin is not installed. Exiting.');
    return false;
  }

  if (isBuildingForRelease(ctx)) {
    printLog('WARNING! You are building for release! Consider removing this plugin from your app beforing publishing it on the store.');
    return false;
  }

  return true;
}

function logStart() {
  console.log("CHCP Local Development Add-on:");
}

function printLog(msg) {
  var formattedMsg = '    ' + msg;

  console.log(formattedMsg);
}

module.exports = function(ctx) {
  logStart();
  if (!isExecutionAllowed(ctx)) {
    return;
  }

  var pluginPreferences = chcpConfigXmlReader.readOptions(ctx);
  if (!pluginPreferences) {
    printLog('WARNING! Can\'t find config.xml! Exiting.');
    return;
  }

  if (pluginPreferences['config-file'].length == 0) {
    pluginPreferences['local-development'].enabled = true;
    printLog('Config-file is not set, enabling local-development mode.');
  }

  if (!pluginPreferences['local-development'].enabled) {
    printLog('Local development mode for CHCP plugin is disabled. Doing nothing.');
    return;
  }

  var localServerURL = getLocalServerURLFromEnvironmentConfig(ctx);
  if (!localServerURL) {
    printLog('Can\'t find .chcpenv config file with local server preferences. Did you run "cordova-hcp server"?');
    return;
  }

  pluginPreferences['config-file'] = localServerURL;
  chcpConfigXmlWriter.writeOptions(ctx, pluginPreferences);

  printLog('Setting config-file to local server: ' + localServerURL);

  buildVersionUpdater.increaseBuildVersion(ctx);
};
