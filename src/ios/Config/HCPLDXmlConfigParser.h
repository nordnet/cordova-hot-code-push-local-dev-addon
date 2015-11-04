//
//  HCPLDXmlConfigParser.h
//  TestCHCP
//
//  Created by Nikolay Demyankov on 04.11.15.
//
//

#import <Foundation/Foundation.h>
#import "HCPLDXmlConfig.h"

@interface HCPLDXmlConfigParser : NSObject

/**
 *  Parse the config and return only plugin specific preferences.
 *
 *  @return plugin preferences from config.xml
 *
 *  @see HCPXmlConfig
 */
+ (HCPLDXmlConfig *)parse;

@end
