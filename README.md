# Cordova Hot Code Push Local Development Add-on

This plugin adds local development feature to the [Hot Code Push plugin](https://github.com/nordnet/cordova-hot-code-push). With it you can develop your app and see the result immediately on the device. No need to restart it on every change you make in your web files: all the updates are uploaded automatically.

## Supported platforms
- Android 4.0.0 or above.
- iOS 8.0 or above. Requires Xcode 8.

## Documentation
- [Installation](#installation)
- [Quick start guide for Cordova project](#quick-start-guide-for-cordova-project)
- [Quick start guide for Ionic project](#quick-start-guide-for-ionic-project)
- [Configuration](#configuration)
- [How it works](#how-it-works)
- [When to use this plugin](#when-to-use-this-plugin)
- [How to uninstall](#how-to-uninstall)

### Installation

This requires cordova 5.0+ (current stable 0.4.2):

```sh
cordova plugin add cordova-hot-code-push-local-dev-addon
```

It is also possible to install via repo url directly (__unstable__):
```sh
cordova plugin add https://github.com/nordnet/cordova-hot-code-push-local-dev-addon.git
```

Starting from `v0.4.0` this plugin **requires Xcode 8**. If you are using Xcode 7 - please, use `v0.3.0`:
```sh
cordova plugin add cordova-hot-code-push-local-dev-addon@0.3.0
```

**Note:** you can install plugin to any project, but it is not gonna do anything without the [Hot Code Push plugin](https://github.com/nordnet/cordova-hot-code-push).

### Quick start guide for Cordova project

1. Create new Cordova project using command line interface and add iOS/Android platforms:

  ```sh
  cordova create TestProject com.example.testproject TestProject
  cd ./TestProject
  cordova platform add android
  cordova platform add ios
  ```
  Or use the existing one.

2. Add Hot Code Push plugin:

  ```sh
  cordova plugin add cordova-hot-code-push-plugin
  ```

3. Add local development feature:

  ```sh
  cordova plugin add cordova-hot-code-push-local-dev-addon
  ```

4. Install Cordova Hot Code Push CLI client:

  ```sh
  npm install -g cordova-hot-code-push-cli
  ```

5. Start local server by executing:

  ```sh
  cordova-hcp server
  ```

  As a result you will see something like this:
  ```
  Running server
  Checking:  /Cordova/TestProject/www
  local_url http://localhost:31284
  Warning: .chcpignore does not exist.
  Build 2015.09.02-10.17.48 created in /Cordova/TestProject/www
  cordova-hcp local server available at: http://localhost:31284
  cordova-hcp public server available at: https://5027caf9.ngrok.com
  ```

6. Open new console window, go to the project root and launch the app:

  ```sh
  cordova run
  ```

  Wait until application is launched for both platforms.

6. Now open your `index.html` page in `www` folder of the `TestProject`, change something in it and save. In a few seconds you will see updated page on the launched devices (emulators).

From this point you can do local development, where all the changes are uploaded on the devices without the need to restart applications on every change you made.

### Quick start guide for Ionic project

1. Create new Ionic project using command line interface and add iOS/Android platforms:

  ```sh
  ionic start TestProject blank
  cd ./TestProject
  ionic platform add android
  ionic platform add ios
  ```
  Or use the existing one.

2. Build project for the first time before adding plugin to it.

  ```sh
  ionic build
  ```

  This is required mainly for iOS, because in some cases Ionic creates iOS project with the wrong name (`HelloCordova`) instead the one that is specified in the `config.xml`. But after the `build` it becomes the correct one.

3. Add Hot Code Push plugin:

  ```sh
  ionic plugin add cordova-hot-code-push-plugin
  ```

4. Add local development feature:

  ```sh
  ionic plugin add cordova-hot-code-push-local-dev-addon
  ```

5. Install Cordova Hot Code Push CLI client:

  ```sh
  npm install -g cordova-hot-code-push-cli
  ```

6. Start local server by executing:

  ```sh
  cordova-hcp server
  ```

  As a result you will see something like this:
  ```
  Running server
  Checking:  /Cordova/TestProject/www
  local_url http://localhost:31284
  Warning: .chcpignore does not exist.
  Build 2015.09.02-10.17.48 created in /Cordova/TestProject/www
  cordova-hcp local server available at: http://localhost:31284
  cordova-hcp public server available at: https://5027caf9.ngrok.com
  ```

7. Open new console window, go to the project root and launch the app:

  ```sh
  ionic run
  ```

  Wait until application is launched for both platforms.

8. Now open your `index.html` page in `www` folder of the `TestProject`, change something in it and save. In a few seconds you will see updated page on the launched devices (emulators).

From this point you can do local development, where all the changes are uploaded on the devices without the need to restart applications on every change you made.

### Configuration

If you just started a new project or didn't define `config-file` in the `config.xml` - then you don't need to do any configuration. You just need to launch the local server by executing `cordova-hcp server`, and the plugin will handle the rest.

But if your `config.xml` already has a `config-file` - then you need to explicitly activate plugin in the app like so:
```xml
<chcp>
  <config-file url="http://mydomain.com/chcp.json" />
  <local-development enabled="true" />
</chcp>
```

As you can see, you just need to add `<local-development />` preference to the `<chcp />` block and set `enabled` to `true`. If it set to `false` - plugin is disabled.

If enabled and local server is running - plugin will take it's url and inject it as a `config-file` in the platform-specific `config.xml`. As a result, your app will be configured to work with the local server.

### How it works

Plugin does his work on two stages:

1. When the project is build (`cordova build` or `cordova run`).
2. When the app is running.

##### Build phase

When you execute `cordova build` plugin:

1. Takes local server's url and inject's it as a `config-file` into platform-specific `config.xml`.
2. Increases build version of the app, to force reinstallation of the of the `www` folder on the external storage. Basically, this reset's the application's cache folder.
3. For iOS app it activates support for Swift code.

As an output you can see something like this in the console:
```
CHCP Local Development Add-on:
    Setting config-file to local server: https://20a51a38.ngrok.com/chcp.json
    Android version code is set to 5
    iOS bundle version set to 4
Swift support activation hook:
    IOS project now has deployment target set to: 7.0
    IOS project option EMBEDDED_CONTENT_CONTAINS_SWIFT set as: YES
    IOS project Runpath Search Paths set to: @executable_path/Frameworks
    Injected swift header HelloCordova-Swift.h into plugin's main header.
```

##### App is running

When the app launches - plugin tries to connect to the local server's socket. Thru that socket we will receive notifications from the server, that new release is ready for upload:
```
File changed:  /Cordova/Test/www/index.html
Build 2015.11.10-10.14.00 created in /Cordova/Test/www
Should trigger reload for build: 2015.11.10-10.14.00
```
When this happens - plugin captures that event and sends command to the main plugin, that it need to fetch the update.

As long as you work on your web project - there is no need to restart the app. The only case when you need to restart it is when you add new plugins. They can have some additional hooks, or native code, and we can't update that on-the-fly.

### When to use this plugin

You should use this plugin for development purpose only. It will help you to speed up the development, and nothing more. When the app is ready and you are prepared for release - don't forget to delete it. It's not gonna work in the release mode anyway. Plus, if you'll try to publish iOS version of the app with this plugin - there is a good chance that it will be rejected because of the Swift code. For some reason when you build your app from console - in the result archive there is no `SwiftSupport` folder. And because of that you will be rejected with the message:
```
Dear developer,

We have discovered one or more issues with your recent delivery for "Directory.". To process your delivery, the following issues must be corrected:

Invalid Swift Support - The SwiftSupport folder is missing. Rebuild your app using the current public (GM) version of Xcode and resubmit it.

Once these issues have been corrected, you can then redeliver the corrected binary.

Regards,

The App Store team
```

### How to uninstall

To remove the plugin just execute:
```sh
cordova plugin remove cordova-hot-code-push-local-dev-addon
```

As a result, it will delete all plugin's files. In the case of the iOS it will also disable Swift support in the project's config by setting `Embedded Content Contains Swift Code` preference to `NO`:
```
CHCP Local Dev plugin cleanup:
    IOS project option EMBEDDED_CONTENT_CONTAINS_SWIFT set as: NO
```
