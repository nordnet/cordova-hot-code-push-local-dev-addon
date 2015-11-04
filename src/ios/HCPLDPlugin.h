//
//  HCPPlugin.h
//
//  Created by Nikolay Demyankov on 07.08.15.
//

#import <Cordova/CDVPlugin.h>
#import <Cordova/CDV.h>

/**
 *  Plugin main class
 */
@interface HCPLDPlugin : CDVPlugin

- (void)jsInitPlugin:(CDVInvokedUrlCommand *)command;

@end
