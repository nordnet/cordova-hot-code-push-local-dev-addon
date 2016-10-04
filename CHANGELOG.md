# Change Log

## v0.4.2 (2016-10-04)

**Bug fixes:**

- [Issue #14](https://github.com/nordnet/cordova-hot-code-push-local-dev-addon/issues/14). Changed library to parse `.plist`. Previous one didn't work on some operating systems.

## v0.4.1 (2016-09-30)

**Bug fixes:**

- [Issue #14](https://github.com/nordnet/cordova-hot-code-push-local-dev-addon/issues/14). Fixed corruption of project's `.plist` file when used with some other plugins (i.e. `cordova-plugin-camera`).

## v0.4.0 (2016-09-21)

**Bug fixes:**

- [Issue #13](https://github.com/nordnet/cordova-hot-code-push-local-dev-addon/issues/13). Project can now be build with Xcode 8. To run in Xcode 7 use v0.3.0.

## v0.3.0 (2016-08-29)

**Bug fixes:**

- Fixed [issue #12](https://github.com/nordnet/cordova-hot-code-push-local-dev-addon/issues/12). Problem was with how `plist` is parsed and saved.

**Enhancements:**

- Updated socket.io library for iOS to v7.0.3.

## v0.2.2 (2016-04-27)

**Bug fixes:**

- Fixed installation failure on Windows.

## v0.2.1 (2016-04-25)

**Bug fixes:**

- Fixed [issue #7](https://github.com/nordnet/cordova-hot-code-push-local-dev-addon/issues/7). `<native-interface />` property is now preserved.
- Fixed typo in `before_plugin_install` hook. If installation has failed - it will show the correct error message.

## v0.2.0 (2016-04-22)

**Enhancements:**

- Dependency node modules are now installed in the plugins folder instead of the projects root folder.
- Updated Socket.IO library for iOS. Now it's version is 6.1.0.
- Updated Socket.IO library for Android. Now it's version is 0.7.

## v0.1.2 (2015-12-04)

**Bug fixes:**

- Fixed [issue #4](https://github.com/nordnet/cordova-hot-code-push-local-dev-addon/issues/4).

## v0.1.1 (2015-10-14)

**Bug fixes:**

- Fixed [issue #2](https://github.com/nordnet/cordova-hot-code-push-local-dev-addon/issues/2).

**Docs:**

- Added change log file.
