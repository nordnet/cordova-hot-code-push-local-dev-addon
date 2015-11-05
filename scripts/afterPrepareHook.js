
var fs = require('fs'),
  path = require('path'),
  chcpConfigXmlReader = require('./lib/chcpConfigXmlReader.js'),
  chcpConfigXmlWriter = require('./lib/chcpConfigXmlWriter.js'),
  RELEASE_BUILD_FLAG = '--release';

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

module.exports = function(ctx) {
  if (isBuildingForRelease(ctx)) {
    console.log('WARNING! You are building for release! Consider removing this plugin from your app beforing publishing it on the store.');
    return;
  }

  var pluginPreferences = chcpConfigXmlReader.readOptions(ctx);
  if (!pluginPreferences) {
    console.log('WARNING! Can\'t find config.xml! Exiting.');
    return;
  }

  if (pluginPreferences['config-file'].length == 0) {
    pluginPreferences['local-development'].enabled = true;
    console.log('Config-file is not set, enabling local-development mode.');
  }

  if (!pluginPreferences['local-development'].enabled) {
    console.log('Local development mode for CHCP plugin is disabled. Doing nothing.');
    return;
  }

  var localServerURL = getLocalServerURLFromEnvironmentConfig(ctx);
  if (!localServerURL) {
    console.log('Can\'t find .chcpenv config file with local server preferences. Did you run "cordova-hcp server"?');
    return;
  }

  pluginPreferences['config-file'] = localServerURL;
  chcpConfigXmlWriter.writeOptions(ctx, pluginPreferences);

  console.log('Set config-file to local server: ' + localServerURL);
};
