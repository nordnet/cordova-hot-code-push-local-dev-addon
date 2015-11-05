(function () {

  var path = require('path'),
    plist = require('plist'),
    fs = require('fs'),
    xmlHelper = require('./xmlHelper.js');

  module.exports = {
    increaseBuildVersion : increaseBuildVersion
  };

  function increaseBuildVersion(cordovaContext) {
    var platforms = cordovaContext.opts.platforms;
    platforms.forEach(function(platform) {
      switch (platform) {
        case 'ios': {
          increaseBuildVersionForIos(cordovaContext);
          break;
        }
        case 'android': {
          increaseBuildVersionForAndroid(cordovaContext);
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  function increaseBuildVersionForAndroid(cordovaContext) {
    var androidManifestFilePath = path.join(cordovaContext.opts.projectRoot, 'platforms', 'android', 'AndroidManifest.xml'),
      manifestFileContent = xmlHelper.readXmlAsJson(androidManifestFilePath);
    if (!manifestFileContent) {
      console.log('ERROR with android');
      return;
    }

    var currentVer = manifestFileContent['manifest']['$']['android:versionCode'];
    var newVersion = parseInt(currentVer) + 1;
    manifestFileContent['manifest']['$']['android:versionCode'] = newVersion.toString();

    xmlHelper.writeJsonAsXml(manifestFileContent, androidManifestFilePath);
  }

  function increaseBuildVersionForIos(cordovaContext) {
    var projectsConfigXmlFilePath = path.join(cordovaContext.opts.projectRoot, 'config.xml'),
      projectsConfigXml = xmlHelper.readXmlAsJson(projectsConfigXmlFilePath);

    if (!projectsConfigXml) {
      console.log('Project\'s config.xml file is not found!');
      return;
    }
    var projectName = projectsConfigXml['widget']['name'][0];

    var pathToIosConfigPlist = path.join(cordovaContext.opts.projectRoot, 'platforms', 'ios', projectName, projectName + '-Info.plist');

    iosPlist = plist.parse(fs.readFileSync(pathToIosConfigPlist, 'utf8'));
    var newVersion = parseInt(iosPlist['CFBundleVersion']) + 1;
    iosPlist['CFBundleVersion'] = newVersion.toString();
    iosPlist['CFBundleShortVersionString'] = newVersion.toString();

    var newPlist = plist.build(iosPlist);
    fs.writeFileSync(pathToIosConfigPlist, newPlist, 'utf8');
  }

})();
