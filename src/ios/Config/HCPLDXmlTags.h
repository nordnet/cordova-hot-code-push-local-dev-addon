//
//  HCPLDXmlTags.h
//  TestCHCP
//
//  Created by Nikolay Demyankov on 04.11.15.
//
//

#import <Foundation/Foundation.h>

@interface HCPLDXmlTags : NSObject

extern NSString *const kHCPLDMainXmlTag;

// Keys for processing application config location on the server
extern NSString *const kHCPLDConfigFileXmlTag;
extern NSString *const kHCPLDConfigFileUrlXmlAttribute;

// Keys for processing local development options
extern NSString *const kHCPLDLocalDevelopmentXmlTag;
extern NSString *const kHCPLDLocalDevelopmentEnabledXmlAttribute;

@end
