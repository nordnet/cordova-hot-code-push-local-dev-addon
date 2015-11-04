//
//  HCPLDXmlConfigParser.m
//  TestCHCP
//
//  Created by Nikolay Demyankov on 04.11.15.
//
//

#import "HCPLDXmlConfigParser.h"
#import "HCPLDXmlTags.h"

@interface HCPLDXmlConfigParser() <NSXMLParserDelegate> {
    BOOL _didParseCHCPBlock;
    BOOL _isInCHCPBlock;
    
    HCPLDXmlConfig *_xmlConfig;
}

@end

@implementation HCPLDXmlConfigParser
#pragma mark Public API

+ (HCPLDXmlConfig *)parse {
    HCPLDXmlConfigParser *parser = [[HCPLDXmlConfigParser alloc] init];
    
    return [parser parseConfig];
}

- (NSURL *)pathToCordovaConfigXml {
    NSString *path = [[NSBundle mainBundle] pathForResource:@"config" ofType:@"xml"];
    
    return [NSURL fileURLWithPath:path];
}

- (HCPLDXmlConfig *)parseConfig {
    NSURL *cordovaConfigURL = [self pathToCordovaConfigXml];
    NSXMLParser *configParser = [[NSXMLParser alloc] initWithContentsOfURL:cordovaConfigURL];
    if (configParser == nil) {
        NSLog(@"Failed to initialize XML parser.");
        return nil;
    }
    
    _xmlConfig = [[HCPLDXmlConfig alloc] init];
    [configParser setDelegate:self];
    [configParser parse];
    
    return _xmlConfig;
}

#pragma mark NSXMLParserDelegate implementation

- (void)parser:(NSXMLParser *)parser didStartElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qName attributes:(NSDictionary *)attributeDict {
    if (_didParseCHCPBlock) {
        return;
    }
    
    if ([elementName isEqualToString:kHCPLDMainXmlTag]) {
        _isInCHCPBlock = YES;
        return;
    }
    
    if (!_isInCHCPBlock) {
        return;
    }
    
    if ([elementName isEqualToString:kHCPLDConfigFileXmlTag]) {
        [self parseConfigUrl:attributeDict];
    } else if ([elementName isEqualToString:kHCPLDLocalDevelopmentXmlTag]) {
        [self parseLocalDevelopmentOptions:attributeDict];
    }
}

- (void)parser:(NSXMLParser *)parser didEndElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qName {
    if (_didParseCHCPBlock || !_isInCHCPBlock) {
        return;
    }
    
    if ([elementName isEqualToString:kHCPLDMainXmlTag]) {
        _didParseCHCPBlock = YES;
        return;
    }
}

#pragma mark Private API

- (void)parseConfigUrl:(NSDictionary *)attributeDict {
    _xmlConfig.configUrl = [NSURL URLWithString:attributeDict[kHCPLDConfigFileUrlXmlAttribute]];
}

- (void)parseLocalDevelopmentOptions:(NSDictionary *)attributeDict {
    _xmlConfig.devOptions.enabled = [(NSNumber *)attributeDict[kHCPLDLocalDevelopmentEnabledXmlAttribute] boolValue];
}

@end
