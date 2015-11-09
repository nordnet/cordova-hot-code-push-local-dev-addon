/**
Hook is executed when plugin is added to the project.
It will check all necessary module dependencies and install the missing ones locally.
*/

var exec = require('child_process').exec,
  path = require('path'),
  fs = require('fs'),
  modules = ['read-package-json'],
  INSTALLATION_FLAG_FILE_NAME = '.installed',
  packageJsonFilePath;

// region NPM specific

/**
 * Discovers module dependencies in plugin's package.json and installs them.
 */
function installModulesFromPackageJson() {
  var readJson = require('read-package-json');
  readJson(packageJsonFilePath, console.error, false, function(err, data) {
    if (err) {
      printMsg('Can\'t read package.json file: ' + err);
      return;
    }

    var dependencies = data['dependencies'];
    if (dependencies) {
      for (var module in dependencies) {
        modules.push(module);
      }
      installRequiredNodeModules(function() {
        printMsg('All dependency modules are installed.');
      });
    }
  });
}

/**
 * Check if node package is installed.
 *
 * @param {String} moduleName
 * @return {Boolean} true if package already installed
 */
function isNodeModuleInstalled(moduleName) {
  var installed = true;
  try {
    var module = require(moduleName);
  } catch (err) {
    installed = false;
  }

  return installed;
}

/**
 * Install node module locally.
 * Basically, it runs 'npm install module_name'.
 *
 * @param {String} moduleName
 * @param {Callback(error)} callback
 */
function installNodeModule(moduleName, callback) {
  if (isNodeModuleInstalled(moduleName)) {
    callback(null);
    return;
  }
  printMsg('Can\'t find module ' + moduleName + ', running npm install');

  var cmd = 'npm install -D ' + moduleName;
  exec(cmd, function(err, stdout, stderr) {
    callback(err);
  });
}

/**
 * Install all required node packages.
 */
function installRequiredNodeModules(callback) {
  if (modules.length == 0) {
    callback();
    return;
  }

  var moduleName = modules.shift();
  installNodeModule(moduleName, function(err) {
    if (err) {
      printMsg('Failed to install module ' + moduleName + ':' + err);
      return;
    }

    printMsg('Module ' + moduleName + ' is installed');
    installRequiredNodeModules(callback);
  });
}

// endregion

// region Logging

function printHeader(msg) {
  console.log(msg);
}

function printMsg(msg) {
  console.log('    ' + msg);
}

// endregion

// region Private API

/**
 * Perform initialization before any execution.
 *
 * @param {Object} ctx - cordova context object
 */
function init(ctx) {
  packageJsonFilePath = path.join(ctx.opts.projectRoot, 'plugins', ctx.opts.plugin.id, 'package.json');
}

/**
 * Check if we already executed this hook.
 *
 * @param {Object} ctx - cordova context
 * @return {Boolean} true if already executed; otherwise - false
 */
function isInstallationAlreadyPerformed(ctx) {
  var pathToInstallFlag = path.join(ctx.opts.projectRoot, 'plugins', ctx.opts.plugin.id, INSTALLATION_FLAG_FILE_NAME),
    isInstalled = false;
  try {
    var content = fs.readFileSync(pathToInstallFlag);
    isInstalled = true;
  } catch (err) {
  }

  return isInstalled;
}

/**
 * Create empty file - indicator, that we tried to install dependency modules after installation.
 * We have to do that, or this hook is gonna be called on any plugin installation.
 */
function createPluginInstalledFlag(ctx) {
  var pathToInstallFlag = path.join(ctx.opts.projectRoot, 'plugins', ctx.opts.plugin.id, INSTALLATION_FLAG_FILE_NAME);

  fs.closeSync(fs.openSync(pathToInstallFlag, 'w'));
}

// endregion

module.exports = function(ctx) {
  // exit if we already executed this hook once
  if (isInstallationAlreadyPerformed(ctx)) {
    return;
  }

  printHeader('CHCP Local Dev add-on checking dependencies:');

  init(ctx);
  installRequiredNodeModules(installModulesFromPackageJson);

  createPluginInstalledFlag(ctx);
};
