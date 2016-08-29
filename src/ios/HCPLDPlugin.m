//
//  HCPPlugin.m
//
//  Created by Nikolay Demyankov on 07.08.15.
//

#import <Cordova/CDVConfigParser.h>

#import "HCPLDPlugin.h"
#import "HCPLDXmlConfig.h"

@interface HCPLDPlugin() {
    SocketIOClient *_socketIOClient;
    HCPLDXmlConfig *_pluginXmllConfig;
    NSString *_defaultCallback;
    BOOL _updateRequested;
    BOOL _isChcpInstalled;
}
@end

static NSString *const NEW_RELEASE_EVENT = @"release";
static NSString *const HOT_CODE_PUSH_PLUGIN = @"HCPPlugin";

@implementation HCPLDPlugin

#pragma mark Lifecycle

-(void)pluginInitialize {
    // if Hot Code Push plugin is not installed - do nothing
    _isChcpInstalled = [self isHotCodePushPluginInstalled];
    if (!_isChcpInstalled) {
        return;
    }
    
    [self parseCordovaConfig];
    [self connectToDevServer];
}

- (void)onAppTerminate {
    [self disconnectFromDevServer];
}

#pragma mark JavaScript methods

- (void)jsInitPlugin:(CDVInvokedUrlCommand *)command {
    _defaultCallback = command.callbackId;
    if (_updateRequested) {
        [self fetchUpdate];
    }
}

#pragma mark Private API

- (BOOL)isHotCodePushPluginInstalled {
    return NSClassFromString(HOT_CODE_PUSH_PLUGIN) != nil;
}

- (void)parseCordovaConfig {
    _pluginXmllConfig = [HCPLDXmlConfig loadFromCordovaConfigXml];
}

- (void)fetchUpdate {
    if (!_defaultCallback) {
        return;
    }
    
    _updateRequested = NO;
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [pluginResult setKeepCallbackAsBool:YES];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:_defaultCallback];
}

#pragma mark Socket IO

- (void)connectToDevServer {
    if (!_pluginXmllConfig.devOptions.isEnabled || (_socketIOClient && _socketIOClient.status == SocketIOClientStatusConnected) ) {
        return;
    }
    
    // reading url of the local server
    NSString *devServerURL = [_pluginXmllConfig.configUrl URLByDeletingLastPathComponent].absoluteString;
    devServerURL = [devServerURL substringToIndex:devServerURL.length-1];
    if (devServerURL.length == 0) {
        NSLog(@"Could not connect to local server: config-file preference is not set.");
        return;
    }
    
    @try {
        _socketIOClient = [[SocketIOClient alloc] initWithSocketURL:[NSURL URLWithString:devServerURL] config:nil];
        
        [_socketIOClient on:@"connect" callback:^(NSArray * _Nonnull data, SocketAckEmitter * _Nullable emitter) {
            NSLog(@"socket connected");
        }];
        [_socketIOClient on:NEW_RELEASE_EVENT callback:^(NSArray * _Nonnull data, SocketAckEmitter * _Nullable emitter) {
            _updateRequested = YES;
            [self fetchUpdate];
        }];
        
        [_socketIOClient on:@"disconnect" callback:^(NSArray * _Nonnull data, SocketAckEmitter * _Nullable emitter) {
            NSLog(@"socket disconnected");
        }];
        
        [_socketIOClient connect];
    } @catch (NSException *e) {
        NSLog(@"Exception: %@", e);
    }
}

- (void)disconnectFromDevServer {
    if (!_pluginXmllConfig.devOptions.isEnabled || !_socketIOClient || _socketIOClient.status != SocketIOClientStatusConnected) {
        return;
    }
    
    [_socketIOClient disconnect];
    [_socketIOClient removeAllHandlers];
    _socketIOClient = nil;
}

@end
