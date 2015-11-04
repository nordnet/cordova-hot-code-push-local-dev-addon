//
//  HCPLDXmlConfig.h
//  TestCHCP
//
//  Created by Nikolay Demyankov on 04.11.15.
//
//

#import <Foundation/Foundation.h>
#import "HCPLDOptions.h"

@interface HCPLDXmlConfig : NSObject

/**
 *  URL to application config, that is stored on the server.
 *  This is a path to chcp.json file.
 */
@property (nonatomic, strong) NSURL *configUrl;

/**
 *  Local development options.
 */
@property (nonatomic, strong, readonly) HCPLDOptions *devOptions;

/**
 *  Load object from config.xml
 *
 *  @return plugin preferences from config.xml
 */
+ (HCPLDXmlConfig *)loadFromCordovaConfigXml;

@end
