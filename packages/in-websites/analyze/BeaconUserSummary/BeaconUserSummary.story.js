/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';

export default {
  component: BeaconUserSummary
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
    meta: props['With Meta?']
      ? {
          primeCustomer: true,
          appVersion: '1.4.1'
        }
      : {},
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
standard.args = {
  'With Meta?': true,
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
    meta: props['With Meta?']
      ? {
          primeCustomer: true,
          appVersion: '1.4.1'
        }
      : {},
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

withLateDefinedUserData.args = {
  'With Meta?': true,
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
