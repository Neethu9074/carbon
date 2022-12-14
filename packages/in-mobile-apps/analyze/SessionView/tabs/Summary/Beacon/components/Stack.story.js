/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Stack from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/Stack';

export default {
  parameters: {
    storyshots: { disable: true },
    chromatic: { disable: true }
  },
  component: Stack
};

export function StackTraceIOS() {
  return <Stack beacon={testData.iosBeacon} />;
}

const testData = {
  iosBeacon: {
    agentVersion: '1.6.0',
    mobileAppId: 'Test-ID',
    mobileAppLabel: 'Test-App',
    timestamp: 1670918869464,
    clockSkew: 2349,
    ingestionTime: 1670918871812,
    duration: 0,
    batchSize: 1,
    sessionId: '8966B180-B86C-4EE0-B278-5759FACD4F79',
    beaconId: '5e888284069ca4cc',
    backendTraceId: '',
    type: 'crash',
    view: 'JSONView',
    customEventName: '',
    meta: {
      ct: 'wifi',
      ver: '0.9',
      v: 'JSONView',
      sym: 'true',
      mt: 'crash',
      mg: 'C0226BA3-486B-4908-A5A4-D568E567C37D',
      id: '254C0172-A08C-4522-B1A5-13205E3219B0',
      cn: 'None'
    },
    userIp: '76.247.0.0',
    userId: '',
    userName: '',
    userEmail: '',
    userLanguages: ['en'],
    bundleIdentifier: 'com.instana.MobileTest.jj',
    appBuild: '1',
    appVersion: '1.0',
    platform: 'iOS',
    osName: 'iOS',
    osVersion: '15.7.1',
    deviceManufacturer: 'Apple',
    deviceModel: 'iPhone9,1',
    deviceHardware: '',
    viewportWidth: 375,
    viewportHeight: 667,
    carrier: '',
    connectionType: '',
    effectiveConnectionType: '',
    latitude: 37.2768,
    longitude: -122.0235,
    accuracyRadius: 5,
    city: 'Saratoga',
    subdivision: 'California',
    subdivisionCode: 'CA',
    country: 'United States',
    countryCode: 'US',
    continent: 'North America',
    continentCode: 'NA',
    httpCallUrl: '',
    httpCallOrigin: '',
    httpCallPath: '',
    httpCallMethod: '',
    httpCallHeaders: {},
    errorCount: 0,
    errorMessage: 'EXC_BREAKPOINT',
    errorId: '',
    errorType: '6',
    stackTrace:
      'Identifier: com.raywenderlich.ShoppingTrolley.jj\nVersion: 1.0(1)\nHardware Model: iPhone9,1\n\nDate/Time:\t 2022-12-13 00:07:00 -0800\nLaunch Time: 2022-12-13 00:07:32 -0800\nOS Version:  iPhone OS 15.7.1 (19H117)\n\nException Type: EXC_BREAKPOINT (SIGTRAP)\nException Code: 1\n\nThread 0:\n0 libswiftCore.dylib 0x185700cb4 <redacted> + 356\n1 libswiftCore.dylib 0x185700cb4 <redacted> + 356\n2 libswiftCore.dylib 0x185700a1c <redacted> + 192\n3 libswiftCore.dylib 0x1857003bc $ss17_assertionFailure__4file4line5flagss5NeverOs12StaticStringV_A2HSus6UInt32VtF + 228\n4 libswiftCore.dylib 0x1856e0274 $ss22_ContiguousArrayBufferV8capacitySivg + 0\n5 libswiftCore.dylib 0x1856e3d14 $sSayxSicig + 84\n6 InstanaAgentExample 0x102a030d8 $s19InstanaAgentExample14ViewControllerC12crashTestNow33_D1735BB98F5ABC6AB9384B341428D038LLyyFySo13UIAlertActionCcfU_ + 308\n7 InstanaAgentExample 0x102a02cc8 $sSo13UIAlertActionCIegg_ABIeyBy_TR + 64\n8 UIKitCore 0x18338ea44 <redacted> + 108\n9 UIKitCore 0x18392bc0c <redacted> + 28\n10 UIKitCore 0x1835cdca8 <redacted> + 1264\n11 UIKitCore 0x183ad999c <redacted> + 208\n12 UIKitCore 0x183473d8c <redacted> + 112\n13 UIKitCore 0x1843fd428 __UIVIEW_IS_EXECUTING_ANIMATION_COMPLETION_BLOCK__ + 28\n14 UIKitCore 0x1834f34e4 <redacted> + 696\n15 UIKitCore 0x1833c7cf0 <redacted> + 244\n16 UIKitCore 0x1833db6b8 <redacted> + 240\n17 UIKitCore 0x1833db80c <redacted> + 580\n18 QuartzCore 0x184ac9730 <redacted> + 276\n19 libdispatch.dylib 0x180c60094\n20 libdispatch.dylib 0x180c0cd44\n21 libdispatch.dylib 0x180c0c994\n22 CoreFoundation 0x180f5b034 <redacted> + 12\n23 CoreFoundation 0x180f18538 <redacted> + 2544\n24 CoreFoundation 0x180f2b194 CFRunLoopRunSpecific + 572\n25 GraphicsServices 0x1a1a62988 GSEventRunModal + 160\n26 UIKitCore 0x18372ea88 <redacted> + 1080\n27 UIKitCore 0x1834c7fc8 UIApplicationMain + 336\n28 InstanaAgentExample 0x102a04a30 main + 64\n29 dyld 0x1033884d0\n\nThread 1:\n0 libsystem_kernel.dylib 0x1bb871aac mach_msg_trap + 8\n1 libsystem_kernel.dylib 0x1bb87207c mach_msg + 72\n2 libdispatch.dylib 0x180c16f7c\n3 libdispatch.dylib 0x180c1730c\n4 libxpc.dylib 0x1dc332a24 xpc_connection_send_message_with_reply_sync + 236\n5 RunningBoardServices 0x18b6f28d4 <redacted> + 412\n6 RunningBoardServices 0x18b6f8f4c <redacted> + 100\n7 RunningBoardServices 0x18b6ec024 <redacted> + 28\n8 RunningBoardServices 0x18b701af4 <redacted> + 360\n9 RunningBoardServices 0x18b70b184 <redacted> + 204\n10 AssertionServices 0x19a28fc58 <redacted> + 180\n11 AssertionServices 0x19a2910a8 <redacted> + 752\n12 libdispatch.dylib 0x180c5f094\n13 libdispatch.dylib 0x180c60094\n14 libdispatch.dylib 0x180c084c4\n15 libdispatch.dylib 0x180c10ec8\n16 libsystem_pthread.dylib 0x1dc308e10 _pthread_wqthread + 284\n17 libsystem_pthread.dylib 0x1dc30893c start_wqthread + 8\n\nThread 2:\n0 libsystem_pthread.dylib 0x1dc308934 start_wqthread + 0\n\nThread 3:\n0 libsystem_pthread.dylib 0x1dc308934 start_wqthread + 0\n\nThread 4:\n0 libsystem_kernel.dylib 0x1bb871aac mach_msg_trap + 8\n1 libsystem_kernel.dylib 0x1bb87207c mach_msg + 72\n2 CoreFoundation 0x180f13cc8 <redacted> + 368\n3 CoreFoundation 0x180f17fd0 <redacted> + 1160\n4 CoreFoundation 0x180f2b194 CFRunLoopRunSpecific + 572\n5 Foundation 0x182638eac <redacted> + 232\n6 Foundation 0x182677fd0 <redacted> + 88\n7 UIKitCore 0x1836adef4 <redacted> + 512\n8 Foundation 0x182685bdc <redacted> + 792\n9 libsystem_pthread.dylib 0x1dc30a348 _pthread_start + 116\n10 libsystem_pthread.dylib 0x1dc308948 thread_start + 8\n\nThread 5:\n0 libsystem_pthread.dylib 0x1dc308934 start_wqthread + 0\n\nThread 6:\n0 libsystem_pthread.dylib 0x1dc308934 start_wqthread + 0\n\nThread 7:\n0 libsystem_pthread.dylib 0x1dc308934 start_wqthread + 0\n\nThread 8:\n0 libsystem_pthread.dylib 0x1dc308934 start_wqthread + 0\n\nThread 9:\n0 libsystem_kernel.dylib 0x1bb871aac mach_msg_trap + 8\n1 libsystem_kernel.dylib 0x1bb87207c mach_msg + 72\n2 CoreFoundation 0x180f13cc8 <redacted> + 368\n3 CoreFoundation 0x180f17fd0 <redacted> + 1160\n4 CoreFoundation 0x180f2b194 CFRunLoopRunSpecific + 572\n5 AudioSession 0x189cd6478 <redacted> + 156\n6 AudioSession 0x189cdf7c8 <redacted> + 88\n7 libsystem_pthread.dylib 0x1dc30a348 _pthread_start + 116\n8 libsystem_pthread.dylib 0x1dc308948 thread_start + 8\n\nBinary Images:\n0x1856ce000 - 0x185b2bfff libswiftCore.dylib arm64 <6ff6c88d49693ec698a2e4967aaff14a> /usr/lib/swift/libswiftCore.dylib\n0x1029fc000 - 0x102c83fff InstanaAgentExample arm64 <893d3935ec713867b1b0be17c5e41cbe> /private/var/containers/Bundle/Application/18BB6DE6-E095-4075-892A-9E644FA7A543/InstanaAgentExample.app/InstanaAgentExample\n0x183249000 - 0x1849e4fff UIKitCore arm64 <697c7d5c976136e98e0f200035bf3f39> /System/Library/PrivateFrameworks/UIKitCore.framework/UIKitCore\n0x184a08000 - 0x184ceffff QuartzCore arm64 <b4c0a7f4601230c3b9a9f48964f29c98> /System/Library/Frameworks/QuartzCore.framework/QuartzCore\n0x180bfc000 - <unknown>   libdispatch.dylib <unknown> <34ef3925030330bf9946ad99311620dd> \n0x180f0d000 - 0x18134afff CoreFoundation arm64 <309e77aa4ff235b98af633af9c2b7929> /System/Library/Frameworks/CoreFoundation.framework/CoreFoundation\n0x1a1a61000 - 0x1a1a69fff GraphicsServices arm64 <8f5bd2c4f5d5358e82bd1b2259a5c050> /System/Library/PrivateFrameworks/GraphicsServices.framework/GraphicsServices\n0x103370000 - <unknown>   dyld <unknown> <f8257149b80f3fad90a4655fa1e964e0> \n0x1bb871000 - 0x1bb8a4fff libsystem_kernel.dylib arm64 <4f2287b8e95f3708a89ea89fe473ad2e> /usr/lib/system/libsystem_kernel.dylib\n0x1dc326000 - 0x1dc35efff libxpc.dylib arm64 <aab1b0ba5b6930d7b517c6a0416a6e2f> /usr/lib/system/libxpc.dylib\n0x18b6e9000 - 0x18b73bfff RunningBoardServices arm64 <fc79e5b41fed39cfbdc33dfa845ecee5> /System/Library/PrivateFrameworks/RunningBoardServices.framework/RunningBoardServices\n0x19a28d000 - 0x19a29dfff AssertionServices arm64 <35c134c2895a3751a31f2ab535139752> /System/Library/PrivateFrameworks/AssertionServices.framework/AssertionServices\n0x1dc307000 - 0x1dc317fff libsystem_pthread.dylib arm64 <9d142bffcae834649d2e72902c470641> /usr/lib/system/libsystem_pthread.dylib\n0x182621000 - 0x182905fff Foundation arm64 <d974a5a366a83fd9b866a0f6908a2369> /System/Library/Frameworks/Foundation.framework/Foundation\n0x189cd0000 - 0x189cf8fff AudioSession arm64 <1b474f882a3f39e0b843e6623d7b6ac1> /System/Library/PrivateFrameworks/AudioSession.framework/AudioSession\n\nEOF'
  }
};
