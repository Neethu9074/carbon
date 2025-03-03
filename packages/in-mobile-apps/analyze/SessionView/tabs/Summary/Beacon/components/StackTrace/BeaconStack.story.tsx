/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import BeaconStack from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/BeaconStack';
import { MobileAppMonitoringBeacon } from 'in-types';

export default {
  parameters: {
    storyshots: { disable: true },
    chromatic: { disable: true }
  },
  component: BeaconStack
};

export function StackTraceIOS() {
  return <BeaconStack beacon={testData.iosBeacon} />;
}

export function StackTraceAndroid() {
  return <BeaconStack beacon={testData.androidBeacon} />;
}

const dummyBeaconData = {
  googlePlayServicesMissing: false,
  decodedBodySize: 0,
  encodedBodySize: 0,
  httpCallStatus: 0,
  rooted: false,
  transferSize: 0
};

const testData: Record<string, MobileAppMonitoringBeacon> = {
  iosBeacon: {
    ...dummyBeaconData,
    agentVersion: '1.6.0',
    mobileAppId: 'GbYH-bmARkeiiUai6vrq3w',
    mobileAppLabel: 'DemoIOSCrash',
    timestamp: 1671607185127,
    clockSkew: 2413,
    ingestionTime: 1671607187539,
    duration: 0,
    batchSize: 1,
    sessionId: '484FB2C7-E7AC-4D91-B47E-A333ABB8710F',
    beaconId: 'ff0083eca3cb7bb4',
    backendTraceId: '',
    type: 'crash',
    view: 'JSONView',
    customEventName: '',
    meta: {
      ct: 'wifi',
      ver: '0.91',
      sym: 'true',
      v: 'JSONView',
      mt: 'crash',
      mg: '564EE8A4-388D-4011-93E5-40FC7A00F3B7',
      id: '204606AE-578A-433E-B80F-356724113B6C',
      cn: 'None'
    },
    userIp: '76.247.182.0',
    userId: '',
    userName: '',
    userEmail: '',
    userLanguages: ['en'],
    bundleIdentifier: 'com.instana.MobileTest.jj',
    appBuild: '1',
    appVersion: '1.0',
    appVersionNumber: 1000000000000000000,
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
    stackTraceParsingStatus: 1,
    stackTrace:
      '{"threads":[{"st":[{"o":"356","n":"libswiftCore.dylib","a":"0x185a14cb4","f":"<redacted>"},{"o":"356","n":"libswiftCore.dylib","a":"0x185a14cb4","f":"<redacted>"},{"o":"192","n":"libswiftCore.dylib","a":"0x185a14a1c","f":"<redacted>"},{"o":"228","n":"libswiftCore.dylib","a":"0x185a143bc","f":"$ss17_assertionFailure__4file4line5flagss5NeverOs12StaticStringV_A2HSus6UInt32VtF"},{"o":"0","n":"libswiftCore.dylib","a":"0x1859f4274","f":"$ss22_ContiguousArrayBufferV8capacitySivg"},{"o":"84","n":"libswiftCore.dylib","a":"0x1859f7d14","f":"$sSayxSicig"},{"o":"308","n":"InstanaAgentExample","a":"0x102920650","f":"$s19InstanaAgentExample14ViewControllerC12crashTestNow33_D1735BB98F5ABC6AB9384B341428D038LLyyFySo13UIAlertActionCcfU_"},{"o":"64","n":"InstanaAgentExample","a":"0x102920240","f":"$sSo13UIAlertActionCIegg_ABIeyBy_TR"},{"o":"108","n":"UIKitCore","a":"0x1836a2a44","f":"<redacted>"},{"o":"28","n":"UIKitCore","a":"0x183c3fc0c","f":"<redacted>"},{"o":"1264","n":"UIKitCore","a":"0x1838e1ca8","f":"<redacted>"},{"o":"208","n":"UIKitCore","a":"0x183ded99c","f":"<redacted>"},{"o":"112","n":"UIKitCore","a":"0x183787d8c","f":"<redacted>"},{"o":"28","n":"UIKitCore","a":"0x184711428","f":"__UIVIEW_IS_EXECUTING_ANIMATION_COMPLETION_BLOCK__"},{"o":"696","n":"UIKitCore","a":"0x1838074e4","f":"<redacted>"},{"o":"244","n":"UIKitCore","a":"0x1836dbcf0","f":"<redacted>"},{"o":"240","n":"UIKitCore","a":"0x1836ef6b8","f":"<redacted>"},{"o":"580","n":"UIKitCore","a":"0x1836ef80c","f":"<redacted>"},{"o":"276","n":"QuartzCore","a":"0x184ddd730","f":"<redacted>"},{"n":"libdispatch.dylib","a":"0x180f74094"},{"n":"libdispatch.dylib","a":"0x180f20d44"},{"n":"libdispatch.dylib","a":"0x180f20994"},{"o":"12","n":"CoreFoundation","a":"0x18126f034","f":"<redacted>"},{"o":"2544","n":"CoreFoundation","a":"0x18122c538","f":"<redacted>"},{"o":"572","n":"CoreFoundation","a":"0x18123f194","f":"CFRunLoopRunSpecific"},{"o":"160","n":"GraphicsServices","a":"0x1a1d76988","f":"GSEventRunModal"},{"o":"1080","n":"UIKitCore","a":"0x183a42a88","f":"<redacted>"},{"o":"336","n":"UIKitCore","a":"0x1837dbfc8","f":"UIApplicationMain"},{"o":"64","n":"InstanaAgentExample","a":"0x102921fa8","f":"main"},{"n":"dyld","a":"0x10358c4d0"}]},{"st":[{"o":"0","n":"libsystem_pthread.dylib","a":"0x1dc61c934","f":"start_wqthread"}]},{"st":[{"o":"0","n":"libsystem_pthread.dylib","a":"0x1dc61c934","f":"start_wqthread"}]},{"st":[{"o":"0","n":"libsystem_pthread.dylib","a":"0x1dc61c934","f":"start_wqthread"}]},{"st":[{"o":"8","n":"libsystem_kernel.dylib","a":"0x1bbb85aac","f":"mach_msg_trap"},{"o":"72","n":"libsystem_kernel.dylib","a":"0x1bbb8607c","f":"mach_msg"},{"o":"368","n":"CoreFoundation","a":"0x181227cc8","f":"<redacted>"},{"o":"1160","n":"CoreFoundation","a":"0x18122bfd0","f":"<redacted>"},{"o":"572","n":"CoreFoundation","a":"0x18123f194","f":"CFRunLoopRunSpecific"},{"o":"232","n":"Foundation","a":"0x18294ceac","f":"<redacted>"},{"o":"88","n":"Foundation","a":"0x18298bfd0","f":"<redacted>"},{"o":"512","n":"UIKitCore","a":"0x1839c1ef4","f":"<redacted>"},{"o":"792","n":"Foundation","a":"0x182999bdc","f":"<redacted>"},{"o":"116","n":"libsystem_pthread.dylib","a":"0x1dc61e348","f":"_pthread_start"},{"o":"8","n":"libsystem_pthread.dylib","a":"0x1dc61c948","f":"thread_start"}]},{"st":[{"o":"0","n":"libsystem_pthread.dylib","a":"0x1dc61c934","f":"start_wqthread"}]},{"st":[{"o":"8","n":"libsystem_kernel.dylib","a":"0x1bbb85aac","f":"mach_msg_trap"},{"o":"72","n":"libsystem_kernel.dylib","a":"0x1bbb8607c","f":"mach_msg"},{"o":"368","n":"CoreFoundation","a":"0x181227cc8","f":"<redacted>"},{"o":"1160","n":"CoreFoundation","a":"0x18122bfd0","f":"<redacted>"},{"o":"572","n":"CoreFoundation","a":"0x18123f194","f":"CFRunLoopRunSpecific"},{"o":"156","n":"AudioSession","a":"0x189fea478","f":"<redacted>"},{"o":"88","n":"AudioSession","a":"0x189ff37c8","f":"<redacted>"},{"o":"116","n":"libsystem_pthread.dylib","a":"0x1dc61e348","f":"_pthread_start"},{"o":"8","n":"libsystem_pthread.dylib","a":"0x1dc61c948","f":"thread_start"}]}],"binaryImages":[{"a1":"6536699904","n":"libswiftCore.dylib","id":"6ff6c88d49693ec698a2e4967aaff14a","p":"\\/usr\\/lib\\/swift\\/libswiftCore.dylib","a":"arm64","a2":"0x185e3ffff"},{"a1":"4338057216","n":"InstanaAgentExample","id":"eb898e9a125331a5b77df21002b87e97","p":"\\/private\\/var\\/containers\\/Bundle\\/Application\\/C07D0361-DCCB-4CBB-A7E3-B510EC017AE1\\/InstanaAgentExample.app\\/InstanaAgentExample","a":"arm64","a2":"0x102babfff"},{"a1":"6498406400","n":"UIKitCore","id":"697c7d5c976136e98e0f200035bf3f39","p":"\\/System\\/Library\\/PrivateFrameworks\\/UIKitCore.framework\\/UIKitCore","a":"arm64","a2":"0x184cf8fff"},{"a1":"6523305984","n":"QuartzCore","id":"b4c0a7f4601230c3b9a9f48964f29c98","p":"\\/System\\/Library\\/Frameworks\\/QuartzCore.framework\\/QuartzCore","a":"arm64","a2":"0x185003fff"},{"a1":"6458245120","n":"libdispatch.dylib","id":"34ef3925030330bf9946ad99311620dd","p":"","a":"<unknown>","a2":"<unknown>  "},{"a1":"6461460480","n":"CoreFoundation","id":"309e77aa4ff235b98af633af9c2b7929","p":"\\/System\\/Library\\/Frameworks\\/CoreFoundation.framework\\/CoreFoundation","a":"arm64","a2":"0x18165efff"},{"a1":"7010209792","n":"GraphicsServices","id":"8f5bd2c4f5d5358e82bd1b2259a5c050","p":"\\/System\\/Library\\/PrivateFrameworks\\/GraphicsServices.framework\\/GraphicsServices","a":"arm64","a2":"0x1a1d7dfff"},{"a1":"4351016960","n":"dyld","id":"f8257149b80f3fad90a4655fa1e964e0","p":"","a":"<unknown>","a2":"<unknown>  "},{"a1":"7992356864","n":"libsystem_pthread.dylib","id":"9d142bffcae834649d2e72902c470641","p":"\\/usr\\/lib\\/system\\/libsystem_pthread.dylib","a":"arm64","a2":"0x1dc62bfff"},{"a1":"7444385792","n":"libsystem_kernel.dylib","id":"4f2287b8e95f3708a89ea89fe473ad2e","p":"\\/usr\\/lib\\/system\\/libsystem_kernel.dylib","a":"arm64","a2":"0x1bbbb8fff"},{"a1":"6485659648","n":"Foundation","id":"d974a5a366a83fd9b866a0f6908a2369","p":"\\/System\\/Library\\/Frameworks\\/Foundation.framework\\/Foundation","a":"arm64","a2":"0x182c19fff"},{"a1":"6610108416","n":"AudioSession","id":"1b474f882a3f39e0b843e6623d7b6ac1","p":"\\/System\\/Library\\/PrivateFrameworks\\/AudioSession.framework\\/AudioSession","a":"arm64","a2":"0x18a00cfff"}],"header":[{"k":"Identifier","v":"com.raywenderlich.ShoppingTrolley.jj"},{"k":"Version","v":"1.0(1)"},{"k":"Hardware Model","v":"iPhone9,1"},{"k":"Date\\/Time","v":"2022-12-20 23:19:00 -0800"},{"k":"Launch Time","v":"2022-12-20 23:18:59 -0800"},{"k":"OS Version","v":"iPhone OS 15.7.1 (19H117)"},{"k":"Exception Type","v":"EXC_BREAKPOINT (SIGTRAP)"},{"k":"Exception Code","v":"1"}]}',
    coldStartTimeMs: 1,
    hotStartTimeMs: 1,
    performanceSubtype: 'performance sub type',
    warmStartTimeMs: 1,
    availableMb: 0,
    maxMb: 0,
    rateLimitBeaconType: '',
    rateLimitCount: 0,
    rateLimitTimeMax: 0,
    rateLimitTimeMin: 0,
    usedMb: 0
  },
  androidBeacon: {
    ...dummyBeaconData,
    agentVersion: '5.2.5-alpha',
    mobileAppId: 'GbYH-bmARkeiiUai6vrq3w',
    mobileAppLabel: 'HelenJiang',
    timestamp: 1672272055573,
    clockSkew: 3064,
    ingestionTime: 1672272058636,
    duration: 0,
    batchSize: 1,
    sessionId: '4037de16-3808-4703-8e51-e40e966e0c66',
    beaconId: '48fd4eab2626ee8a',
    backendTraceId: '',
    type: 'crash',
    view: '',
    customEventName: '',
    meta: {
      testKey: 'testValue'
    },
    userIp: '76.247.182.0',
    userId: '1234567890',
    userName: 'instana android agent demo',
    userEmail: 'instana@example.com',
    userLanguages: ['en-US'],
    bundleIdentifier: 'com.instana.mobileeum.debug',
    appBuild: '1',
    appVersion: '5.0',
    appVersionNumber: 5000000000000000000,
    platform: 'Android',
    osName: 'Android',
    osVersion: '13 (33)',
    deviceManufacturer: 'Google',
    deviceModel: 'sdk_gphone64_arm64',
    deviceHardware: 'ranchu',
    viewportWidth: 1440,
    viewportHeight: 2560,
    carrier: '',
    connectionType: 'wifi',
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
    errorMessage: 'java.lang.RuntimeException (Inner Exception found)',
    errorId: 'e3d3539859507564086f2ccbdfe28362',
    errorType: '',
    stackTraceParsingStatus: 1,
    stackTrace:
      'java.lang.RuntimeException: Inner Exception found\n\tat com.instana.mobileeum.ui.performance.PerformanceViewModel.forceUnhandledExceptionWrapper(PerformanceViewModel.kt:80)\n\tat com.instana.mobileeum.ui.performance.PerformanceViewModel.forceUnhandledException(PerformanceViewModel.kt:44)\n\tat com.instana.mobileeum.ui.performance.PerformanceFragment.onCreateView$lambda$3(PerformanceFragment.kt:50)\n\tat com.instana.mobileeum.ui.performance.PerformanceFragment.$r8$lambda$oK1rZ2WLO-IDdVf8RK8viFp0F_I(Unknown Source:0)\n\tat com.instana.mobileeum.ui.performance.PerformanceFragment$$ExternalSyntheticLambda3.onClick(Unknown Source:2)\n\tat android.view.View.performClick(View.java:7506)\n\tat com.google.android.material.button.MaterialButton.performClick(MaterialButton.java:1194)\n\tat android.view.View.performClickInternal(View.java:7483)\n\tat android.view.View.-$$Nest$mperformClickInternal(Unknown Source:0)\n\tat android.view.View$PerformClick.run(View.java:29334)\n\tat android.os.Handler.handleCallback(Handler.java:942)\n\tat android.os.Handler.dispatchMessage(Handler.java:99)\n\tat android.os.Looper.loopOnce(Looper.java:201)\n\tat android.os.Looper.loop(Looper.java:288)\n\tat android.app.ActivityThread.main(ActivityThread.java:7872)\n\tat java.lang.reflect.Method.invoke(Native Method)\n\tat com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:548)\n\tat com.android.internal.os.ZygoteInit.main(ZygoteInit.java:936)\nCaused by: java.lang.RuntimeException: force direct unhandled exception\n\tat com.instana.mobileeum.ui.performance.PerformanceViewModel.forceUnhandledExceptionInner(PerformanceViewModel.kt:85)\n\tat com.instana.mobileeum.ui.performance.PerformanceViewModel.forceUnhandledExceptionWrapper(PerformanceViewModel.kt:78)\n\t... 17 more\n',
    coldStartTimeMs: 1,
    hotStartTimeMs: 1,
    performanceSubtype: 'performance sub type',
    warmStartTimeMs: 1,
    availableMb: 0,
    maxMb: 0,
    rateLimitBeaconType: '',
    rateLimitCount: 0,
    rateLimitTimeMax: 0,
    rateLimitTimeMin: 0,
    usedMb: 0
  }
};
