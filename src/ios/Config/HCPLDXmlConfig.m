//
//  HCPLDXmlConfig.m
//  TestCHCP
//
//  Created by Nikolay Demyankov on 04.11.15.
//
//

#import "HCPLDXmlConfig.h"
#import "HCPLDXmlConfigParser.h"

@implementation HCPLDXmlConfig

- (instancetype)init {
    self = [super init];
    if (self) {
        _configUrl = nil;
        _devOptions = [[HCPLDOptions alloc] init];
    }
    
    return self;
}

+ (instancetype)loadFromCordovaConfigXml {
    return [HCPLDXmlConfigParser parse];
}

@end
