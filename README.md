# Cordova Hot Code Push Local Development Add-on

Cordova plugin that adds local development feature to the [Hot Code Push plugin](https://github.com/nordnet/cordova-hot-code-push). With it you can develop your app and see the result immediately on the device. No need to restart it on every change you make in your web files: all the updates are uploaded automatically.

## Supported platforms
- Android 4.0.0 or above.
- iOS 7.0 or above. Requires Xcode 7 and Swift 2.

## Documentation
- [Installation](#installation)
- [Quick start guide for Cordova project](#quick-start-guide-for-cordova-project)
- [Quick start guide for Ionic project](#quick-start-guide-for-ionic-project)
- [When to use this plugin](#when-to-use-this-plugin)
- [How it works](#how-it-works)
- [How to uninstall](#how-to-uninstall)

### Installation
This requires cordova 5.0+ (current stable 0.1)
```sh
    cordova plugin add cordova-hot-code-push-local-dev-addon
```

It is also possible to install via repo url directly (__unstable__)
```sh
    cordova plugin add https://github.com/nordnet/cordova-hot-code-push-local-dev-addon.git
```

**Note:** you can install plugin to any project, but it is not gonna work without the Hot Code Push plugin. Although, it is not gonna crash your app.

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

### When to use this plugin

You should use this plugin for development purpose only. After launching local server (`cordova-hcp server`) and starting the app (`cordova run`) - you can do all the development you want and see the results immediately on the device (or emulator). With this plugin you don't need to restart the app on every change you have made.

The only case when you need to restart the app is when you add new plugins to the project. They can have some additional hooks, or native code, and we can't update that on-the-fly.

On each new build plugin will increase build version of the app, so the Hot Code Push plugin would re-install the `www` folder from the bundle on the external storage. Basically, this reset's the application's cache folder.

When development is done and you are ready for release - don't forget to delete this plugin. It's not gonna work in the release mode anyway.

### Configuration

If you just started a new project and didn't define `config-file` in the `config.xml` - then you don't need to do any configuration. You just need to launch the local server by executing `cordova-hcp server`, and the plugin will set `config-file` to it automatically in the platform-specific `config.xml`. That is why there is nothing about `config-file` in the quick start guides.

But if your `config.xml` already has a `config-file` - then you need to explicitly activate plugin in the app like so:
```xml
<chcp>
  <config-file url="http://mydomain.com/chcp.json" />
  <local-development enabled="true" />
</chcp>
```

As you can see, you just need to add `<local-development />` preference to the `<chcp />` block and set `enabled` to `true`. If it set to `false` - plugin is disabled.

If enabled and local server is running - plugin will take it's url and inject it as a `config-file` in the platform-specific `config.xml`. As a result, your app will be configured to work with the local server.

### How to uninstall

You should remove this plugin from the app when development is done. And there are two reasons for that:

1. Plugin connects to the local server via socket. And since in release version there is no local server - you don't need this unused code.
2. In the case of the iOS it uses Socket.IO library, which is written in the Swift. And if you will try to publish your app with it - it can be rejected. And you don't want that.

To remove the plugin just execute:
```sh
cordova plugin remove cordova-hot-code-push-local-dev-addon
```

As a result, it will delete all plugin's files. In the case of the iOS it will also disable Swift support in the project's config by setting `Embedded Content Contains Swift Code` preference to `NO`.
