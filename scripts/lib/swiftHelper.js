/*
Helper class to work with Swift.
Mainly, it has only two method: to activate and to deactivate swift support in the project.
*/

var path = require('path');
var fs = require('fs');
var logger = require('./logger.js');
var IOS_DEPLOYMENT_TARGET = '8.0';
var COMMENT_KEY = /_comment$/;
var PLUGIN_NAME = 'cordova-hot-code-push-local-dev-addon';
var PLUGIN_MAIN_HEADER = 'HCPLDPlugin.h';
var context;
var projectRoot;
var projectName;
var projectModuleName;
var iosPlatformPath;

module.exports = {
  activate: activate,
  disable: disable
};

/**
 * Activate swift support in the project.
 *
 * @param {Object} cordovaContext - cordova context
 */
function activate(cordovaContext) {

  init(cordovaContext);

  // injecting options in project file
  var projectFile = loadProjectFile();
  injectSwiftOptionsInProjectConfig(projectFile.xcode);
  projectFile.write();

  // injecting inclusion of Swift header
  injectSwiftHeader();
}

/**
 * Remove swift support from the project.
 *
 * @param {Object} cordovaContext - cordova context
 */
function disable(cordovaContext) {
  init(cordovaContext);

  var projectFile = loadProjectFile();
  removeSwiftOptionsFromProjectConfig(projectFile.xcode);
  projectFile.write();
}

// region General private methods

/**
 * Initialize before execution.
 *
 * @param {Object} ctx - cordova context instance
 */
function init(ctx) {
  context = ctx;
  projectRoot = ctx.opts.projectRoot;
  projectName = getProjectName(ctx, projectRoot);
  iosPlatformPath = path.join(projectRoot, 'platforms', 'ios')
}

/**
 * Load iOS project file from platform specific folder.
 *
 * @return {Object} projectFile - project file information
 */
function loadProjectFile() {
  var platform_ios,
    projectFile;

  try {
    // try pre-5.0 cordova structure
    platform_ios = context.requireCordovaModule('cordova-lib/src/plugman/platforms')['ios'];
    projectFile = platform_ios.parseProjectFile(iosPlatformPath);
  } catch (e) {
    // let's try cordova 5.0 structure
    platform_ios = context.requireCordovaModule('cordova-lib/src/plugman/platforms/ios');
    projectFile = platform_ios.parseProjectFile(iosPlatformPath);
  }

  return projectFile;
}

/**
 * Get name of the current project.
 *
 * @param {Object} ctx - cordova context instance
 * @param {String} projectRoot - current root of the project
 *
 * @return {String} name of the project
 */
function getProjectName(ctx, projectRoot) {
  var cordova_util = ctx.requireCordovaModule('cordova-lib/src/cordova/util'),
    xml = cordova_util.projectConfig(projectRoot),
    ConfigParser;

  // If we are running Cordova 5.4 or abova - use parser from cordova-common.
  // Otherwise - from cordova-lib.
  try {
    ConfigParser = ctx.requireCordovaModule('cordova-common/src/ConfigParser/ConfigParser');
  } catch (e) {
    ConfigParser = ctx.requireCordovaModule('cordova-lib/src/configparser/ConfigParser')
  }

  return new ConfigParser(xml).name();
}

/**
 * Remove comments from the file.
 *
 * @param {Object} obj - file object
 * @return {Object} file object without comments
 */
function nonComments(obj) {
  var keys = Object.keys(obj),
    newObj = {};

  for (var i = 0, len = keys.length; i < len; i++) {
    if (!COMMENT_KEY.test(keys[i])) {
      newObj[keys[i]] = obj[keys[i]];
    }
  }

  return newObj;
}

// endregion

// region Swift options injection

/**
 * Inject Swift options into project configuration file.
 *
 * @param {Object} xcodeProject - xcode project file instance
 */
function injectSwiftOptionsInProjectConfig(xcodeProject) {
  var configurations = nonComments(xcodeProject.pbxXCBuildConfigurationSection()),
    config,
    buildSettings;

  for (config in configurations) {
    buildSettings = configurations[config].buildSettings;
    buildSettings['IPHONEOS_DEPLOYMENT_TARGET'] = IOS_DEPLOYMENT_TARGET;
    buildSettings['EMBEDDED_CONTENT_CONTAINS_SWIFT'] = "YES";
    buildSettings['LD_RUNPATH_SEARCH_PATHS'] = '"@executable_path/Frameworks"';
    buildSettings['SWIFT_VERSION'] = '3.0';

    // if project module name is not defined - set it with value from build settings
    if ((!projectModuleName || projectModuleName.length == 0) && buildSettings['PRODUCT_NAME']) {
      setProjectModuleName(buildSettings['PRODUCT_NAME']);
    }
  }
  logger.info('iOS project now has deployment target set to: ' + IOS_DEPLOYMENT_TARGET);
  logger.info('iOS project option EMBEDDED_CONTENT_CONTAINS_SWIFT set as: YES');
  logger.info('iOS project Runpath Search Paths set to: @executable_path/Frameworks');
  logger.info('iOS project "Use Legacy Swift Language Version" set to: NO');
}

/**
 * Set project module name from the build settings.
 * Will be used to generate name of the Swift header.
 *
 * @param {String} nameFromBuildSettings - name of the product from build settings
 */
function setProjectModuleName(nameFromBuildSettings) {
  projectModuleName = nameFromBuildSettings.trim().replace(/"/g, '');
}

/**
 * Inject Swift inclusion header into ProjectName-Prefix.pch.
 * This way we ensure that Swift libraries are accessible in all project classes.
 */
function injectSwiftHeader() {
  // path to Prefix file and the name of included header
  var pluginHeaderFilePath = path.join(iosPlatformPath, projectName, 'Plugins', PLUGIN_NAME, PLUGIN_MAIN_HEADER),
    swiftImportHeader = generateSwiftHeaderFromProjectName(projectModuleName),
    headerFileContent;

  // read header file
  try {
    headerFileContent = fs.readFileSync(pluginHeaderFilePath, 'utf8');
  } catch (err) {
    logger.error(err);
    return;
  }

  // don't import if it is already there
  if (headerFileContent.indexOf(swiftImportHeader) > -1) {
    return;
  }

  // set header
  headerFileContent = setSwiftHeader(headerFileContent, swiftImportHeader);

  // save changes
  fs.writeFileSync(pluginHeaderFilePath, headerFileContent, 'utf8');

  logger.info('Injected swift header ' + swiftImportHeader + ' into plugin\'s main header.');
}

/**
 * Set proper header for Swift support.
 *
 * @param {String} prefixFileContent - Prefix.pch file content
 * @param {String} swiftImportHeader - header to set
 * @return {String} Prefix.pch file content with correct Swift header import
 */
function setSwiftHeader(prefixFileContent, swiftImportHeader) {
  // remove old import if there is any;
  // can occur if we change product name
  var found = prefixFileContent.match(/(\"[a-z0-9_]+-Swift.h\")/i);
  if (found && found.length > 0) {
    prefixFileContent = prefixFileContent.replace(found[0], '"' + swiftImportHeader + '"');
  } else {
    prefixFileContent = '#import "' + swiftImportHeader + '"\n' + prefixFileContent;
  }

  return prefixFileContent;
}

/**
 * Generate name of the header file for Swift support.
 * Details on Swift header name could be found here: https://developer.apple.com/library/ios/documentation/Swift/Conceptual/BuildingCocoaApps/MixandMatch.html
 *
 * @param {String} projectModuleName - projects module name from build configuration
 * @return {String} Swift header name
 */
function generateSwiftHeaderFromProjectName(projectModuleName) {
  var normalizedName = projectModuleName.replace(/([^a-z0-9]+)/gi, '_');

  return normalizedName + '-Swift.h'
}

// endregion

// region Disable

/**
 * Remove Swift options from the project file.
 *
 * @param {Object} xcodeProject - xcode project
 */
function removeSwiftOptionsFromProjectConfig(xcodeProject) {
  var configurations = nonComments(xcodeProject.pbxXCBuildConfigurationSection()),
    config,
    buildSettings;

  for (config in configurations) {
    buildSettings = configurations[config].buildSettings;
    buildSettings['EMBEDDED_CONTENT_CONTAINS_SWIFT'] = "NO";
  }

  logger.info('IOS project option EMBEDDED_CONTENT_CONTAINS_SWIFT set as: NO');
}

// endregion
