/*
Helper class that will increase build version of the app on each build.
This way we will forse main plugin to install www folder from the assets.
Otherwise - it will use the cached version.
*/
(function () {

  var path = require('path'),
    plist = require('plist'),
    microtime = require('microtime'),
    fs = require('fs'),
    xmlHelper = require('./xmlHelper.js'),
    logger = require('./logger.js'),
    IOS_PLATFORM = 'ios',
    ANDROID_PLATFORM = 'android';

  module.exports = {
    increaseBuildVersion : increaseBuildVersion
  };

  // region Public API

  /**
   * Increase build version of the app.
   *
   * @param {Object} cordovaContext - cordova's context
   */
  function increaseBuildVersion(cordovaContext) {
    var platforms = cordovaContext.opts.platforms;

    // increase only for the platforms we are building for right now
    platforms.forEach(function(platform) {
      switch (platform) {
        case IOS_PLATFORM: {
          increaseBuildVersionForIos(cordovaContext);
          break;
        }
        case ANDROID_PLATFORM: {
          increaseBuildVersionForAndroid(cordovaContext);
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  // endregion

  // region Private API

  /**
   * Increase value of the android:versionCode of the app.
   *
   * @param {Object} cordovaContext - cordova's context
   */
  function increaseBuildVersionForAndroid(cordovaContext) {
    var androidManifestFilePath = path.join(cordovaContext.opts.projectRoot, 'platforms', ANDROID_PLATFORM, 'AndroidManifest.xml'),
      manifestFileContent = xmlHelper.readXmlAsJson(androidManifestFilePath);

    if (!manifestFileContent) {
      logger.error('ERROR with android');
      return;
    }

    var newVersion = parseInt(microtime.nowDouble());
    manifestFileContent['manifest']['$']['android:versionCode'] = newVersion.toString();

    xmlHelper.writeJsonAsXml(manifestFileContent, androidManifestFilePath);
  }

  function increaseBuildVersionForIos(cordovaContext) {
    var projectsConfigXmlFilePath = path.join(cordovaContext.opts.projectRoot, 'config.xml'),
      projectsConfigXml = xmlHelper.readXmlAsJson(projectsConfigXmlFilePath);

    if (!projectsConfigXml) {
      logger.error('Project\'s config.xml file is not found!');
      return;
    }

    var projectName = projectsConfigXml['widget']['name'][0];

    var pathToIosConfigPlist = path.join(cordovaContext.opts.projectRoot, 'platforms', IOS_PLATFORM, projectName, projectName + '-Info.plist');

    iosPlist = plist.parse(fs.readFileSync(pathToIosConfigPlist, 'utf8'));
    var newVersion = parseInt(microtime.nowDouble());
    iosPlist['CFBundleVersion'] = newVersion.toString();
    iosPlist['CFBundleShortVersionString'] = newVersion.toString();

    var newPlist = plist.build(iosPlist);
    fs.writeFileSync(pathToIosConfigPlist, newPlist, 'utf8');
  }

  // endregion

})();
