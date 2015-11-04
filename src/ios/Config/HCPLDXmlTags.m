//
//  HCPLDXmlTags.m
//  TestCHCP
//
//  Created by Nikolay Demyankov on 04.11.15.
//
//

#import "HCPLDXmlTags.h"

@implementation HCPLDXmlTags

// Keys for processing local development options
NSString *const kHCPLDLocalDevelopmentXmlTag = @"local-development";
NSString *const kHCPLDLocalDevelopmentEnabledXmlAttribute = @"enabled";

NSString *const kHCPLDMainXmlTag = @"chcp";

// Keys for processing application config location on the server
NSString *const kHCPLDConfigFileXmlTag = @"config-file";
NSString *const kHCPLDConfigFileUrlXmlAttribute = @"url";

@end
