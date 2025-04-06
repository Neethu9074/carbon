/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';

export default {
  component: BeaconUserSummary
};

const argTypes = {
  Meta: {
    options: ['empty', 'small', 'large'],
    control: { type: 'radio' }
  }
};

const metaOptions = {
  empty: {},
  small: {
    primeCustomer: true,
    appVersion: '1.4.1'
  },
  large: {
    allAnalyticsServices: false,
    walkmeAnalyticsServices: false,
    assistmeGuidanceServices: false,
    allSupportAndResearchServices: false,
    autoRefresh: false,
    'build.date': '2022-05-02T16:37:45.081Z',
    'build.revision': 'a3c03cc1f009f018241201a5e5c69b9b6b97b966',
    'build.tag': '1.225.236',
    instanaRegion: 'pink',
    locale: 'en-US',
    productTips: false,
    region: 'pink',
    selfDefinedRole: 'devOps',
    subscribeEvent: 'getCallGroups',
    subscriptionId: 187,
    subscriptionPayload: {
      filter: {
        timeConfig: {
          autoRefresh: false,
          focusedMoment: 1651563063188,
          to: 1651563063188,
          windowSize: 3600000
        }
      },
      group: {
        groupbyTag: 'application.name',
        groupbyTagEntity: 'DESTINATION'
      },
      includeInternal: false,
      includeSynthetic: false,
      metrics: {
        calls_SUM: {
          aggregation: 'SUM',
          metric: 'calls'
        },
        calls_SUM_sparkChart: {
          aggregation: 'SUM',
          granularity: 60000,
          metric: 'calls'
        },
        errors_MEAN: {
          aggregation: 'MEAN',
          metric: 'errors'
        },
        errors_MEAN_sparkChart: {
          aggregation: 'MEAN',
          granularity: 60000,
          metric: 'errors'
        },
        latency_MEAN: {
          aggregation: 'MEAN',
          metric: 'latency'
        },
        latency_MEAN_sparkChart: {
          aggregation: 'MEAN',
          granularity: 60000,
          metric: 'latency'
        }
      },
      order: {
        by: 'calls_SUM',
        collation: 'en-US',
        direction: 'DESC'
      },
      pagination: {
        retrievalSize: 20
      },
      queryPrecision: 'FULL',
      subscriptionId: 187,
      tagFilterExpression: {
        elements: [],
        logicalOperator: 'AND',
        type: 'EXPRESSION'
      }
    },
    tenant: 'instana',
    testingGroup: false,
    unit: 'test',
    windowSize: 3600000
  }
};

export const standard = props => {
  const fullBeacon = {
    websiteId: 'WWqjvIHuQfiIEJReNNzX7g',
    websiteLabel: 'Shop Shop',
    page: 'landing',
    phase: 'pageLoad',
    timestamp: 1542540668963,
    duration: 418,
    batchSize: 1,
    accurateTimingsAvailable: false,
    deprecations: [],
    pageLoadId: '164deef5482f9aab',
    beaconId: '164deef5482f9aab',
    backendTraceId: '1efe58365708ab',
    type: 'pageLoad',
    customEventName: '',
    meta: metaOptions[props['Meta']],
    locationUrl: 'http://shop.example.com:6712/?userId=03f15da4-a316-4316-bffe-f5eceed78dd0',
    locationOrigin: 'http://shop.example.com:6712',
    locationPath: '/',
    errorCount: 0,
    errorMessage: '',
    errorId: '',
    errorType: '',
    stackTrace: '',
    componentStack: '',
    userIp: props['User IP'],
    userId: props['User ID'],
    userName: props['User Name'],
    userEmail: props['User Email'],
    userLanguages: ['sr-Latn-RS', 'en-US'],
    deviceType: '',
    browserName: props['Browser'],
    browserVersion: props['Browser Version'],
    osName: props['OS'],
    osVersion: props['OS Version'],
    windowHidden: false,
    windowWidth: 800,
    windowHeight: 600,
    latitude: props['Latitude'],
    longitude: props['Longitude'],
    accuracyRadius: -1,
    city: props['City'],
    subdivision: props['Subdivision'],
    subdivisionCode: props['Subdivision Code'],
    country: props['Country'],
    countryCode: props['Country Code'],
    continent: props['Continent'],
    continentCode: props['Continent Code'],
    httpCallUrl: '',
    httpCallOrigin: '',
    httpCallPath: '',
    httpCallMethod: '',
    httpCallStatus: -1,
    httpCallCorrelationAttempted: false,
    httpCallAsynchronous: false,
    initiator: 'html',
    resourceType: 'document',
    cacheInteraction: '',
    encodedBodySize: -1,
    decodedBodySize: -1,
    transferSize: -1,
    unloadTime: 0,
    redirectTime: 0,
    appCacheTime: 22,
    dnsTime: 1,
    tcpTime: 0,
    sslTime: 0,
    requestTime: 100,
    responseTime: 3,
    processingTime: 290,
    onLoadTime: 101,
    backendTime: 123,
    frontendTime: 396,
    domTime: 282,
    childrenTime: 109,
    firstPaintTime: -1,
    firstContentfulPaintTime: -1
  };
  return <BeaconUserSummary beacon={fullBeacon} />;
};
standard.argTypes = argTypes;
standard.args = {
  Meta: 'small',
  'User IP': '245.170.13.0',
  'User ID': '03f15da4-a316-4316-bffe-f5eceed78dd0',
  'User Name': 'Jemimah Gellately',
  'User Email': 'jgellately9@technorati.com',
  Browser: 'Chromium',
  'Browser Version': '17',
  OS: 'Ubuntu',
  'OS Version': '12.04',
  Latitude: 51.5788648 /*{
      range: true,
      min: -180,
      max: 180,
      step: 1
    },
    */,
  Longitude: 6.1597109 /*{
      range: true,
      min: -180,
      max: 180,
      step: 1
    },
    */,
  City: 'Kevelaer',
  Subdivision: 'North Rhine-Westphalia',
  'Subdivision Code': 'DE-NW',
  Country: 'Germany',
  'Country Code': 'DE',
  Continent: 'Europe',
  'Continent Code': 'EU'
};

export const withLateDefinedUserData = props => {
  const fullBeacon = {
    websiteId: 'WWqjvIHuQfiIEJReNNzX7g',
    websiteLabel: 'Shop Shop',
    page: 'landing',
    phase: 'pageLoad',
    timestamp: 1542540668963,
    duration: 418,
    batchSize: 1,
    accurateTimingsAvailable: false,
    deprecations: [],
    pageLoadId: '164deef5482f9aab',
    beaconId: '164deef5482f9aab',
    backendTraceId: '1efe58365708ab',
    type: 'pageLoad',
    customEventName: '',
    meta: metaOptions[props['Meta']],
    locationUrl: 'http://shop.example.com:6712/?userId=03f15da4-a316-4316-bffe-f5eceed78dd0',
    locationOrigin: 'http://shop.example.com:6712',
    locationPath: '/',
    errorCount: 0,
    errorMessage: '',
    errorId: '',
    errorType: '',
    stackTrace: '',
    componentStack: '',
    userIp: props['User IP'],
    userId: props['User ID'],
    userName: props['User Name'],
    userEmail: props['User Email'],
    userLanguages: ['sr-Latn-RS', 'en-US'],
    deviceType: '',
    browserName: props['Browser'],
    browserVersion: props['Browser Version'],
    osName: props['OS'],
    osVersion: props['OS Version'],
    windowHidden: false,
    windowWidth: 800,
    windowHeight: 600,
    latitude: props['Latitude'],
    longitude: props['Longitude'],
    accuracyRadius: -1,
    city: props['City'],
    subdivision: props['Subdivision'],
    subdivisionCode: props['Subdivision Code'],
    country: props['Country'],
    countryCode: props['Country Code'],
    continent: props['Continent'],
    continentCode: props['Continent Code'],
    httpCallUrl: '',
    httpCallOrigin: '',
    httpCallPath: '',
    httpCallMethod: '',
    httpCallStatus: -1,
    httpCallCorrelationAttempted: false,
    httpCallAsynchronous: false,
    initiator: 'html',
    resourceType: 'document',
    cacheInteraction: '',
    encodedBodySize: -1,
    decodedBodySize: -1,
    transferSize: -1,
    unloadTime: 0,
    redirectTime: 0,
    appCacheTime: 22,
    dnsTime: 1,
    tcpTime: 0,
    sslTime: 0,
    requestTime: 100,
    responseTime: 3,
    processingTime: 290,
    onLoadTime: 101,
    backendTime: 123,
    frontendTime: 396,
    domTime: 282,
    childrenTime: 109,
    firstPaintTime: -1,
    firstContentfulPaintTime: -1
  };
  const beaconWithoutUserData = {
    ...fullBeacon,
    userId: null,
    userName: null,
    userEmail: null
  };

  return <BeaconUserSummary beacon={beaconWithoutUserData} beacons={[beaconWithoutUserData, fullBeacon]} />;
};

withLateDefinedUserData.argTypes = argTypes;
withLateDefinedUserData.args = {
  Meta: 'empty',
  'User IP': '245.170.13.0',
  'User ID': '03f15da4-a316-4316-bffe-f5eceed78dd0',
  'User Name': 'Jemimah Gellately',
  'User Email': 'jgellately9@technorati.com',
  Browser: 'Chromium',
  'Browser Version': '17',
  OS: 'Ubuntu',
  'OS Version': '12.04',
  Latitude: 51.5788648 /*{
      range: true,
      min: -180,
      max: 180,
      step: 1
    },
    */,
  Longitude: 6.1597109 /*{
      range: true,
      min: -180,
      max: 180,
      step: 1
    },
    */,
  City: 'Kevelaer',
  Subdivision: 'North Rhine-Westphalia',
  'Subdivision Code': 'DE-NW',
  Country: 'Germany',
  'Country Code': 'DE',
  Continent: 'Europe',
  'Continent Code': 'EU'
};
