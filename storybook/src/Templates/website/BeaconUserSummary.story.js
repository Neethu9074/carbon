/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import React from 'react';

import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';

export default {
  title: 'Templates|website/BeaconUserSummary',
  component: BeaconUserSummary,
  decorators: [withKnobs]
};

export const standard = () => {
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
    meta: boolean('With Meta?', true)
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
    userIp: text('User IP', '245.170.13.0'),
    userId: text('User ID', '03f15da4-a316-4316-bffe-f5eceed78dd0'),
    userName: text('User Name', 'Jemimah Gellately'),
    userEmail: text('User Email', 'jgellately9@technorati.com'),
    userLanguages: ['sr-Latn-RS', 'en-US'],
    deviceType: '',
    browserName: text('Browser', 'Chromium'),
    browserVersion: text('Browser Version', '17'),
    osName: text('OS', 'Ubuntu'),
    osVersion: text('OS Version', '12.04'),
    windowHidden: false,
    windowWidth: 800,
    windowHeight: 600,
    latitude: number('Latitude', 51.5788648, {
      range: true,
      min: -180,
      max: 180,
      step: 1
    }),
    longitude: number('Longitude', 6.1597109, {
      range: true,
      min: -180,
      max: 180,
      step: 1
    }),
    accuracyRadius: -1,
    city: text('City', 'Kevelaer'),
    subdivision: text('Subdivision', 'North Rhine-Westphalia'),
    subdivisionCode: text('Subdivision Code', 'DE-NW'),
    country: text('Country', 'Germany'),
    countryCode: text('Country Code', 'DE'),
    continent: text('Continent', 'Europe'),
    continentCode: text('Continent Code', 'EU'),
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

export const withLateDefinedUserData = () => {
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
    meta: boolean('With Meta?', true)
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
    userIp: text('User IP', '245.170.13.0'),
    userId: text('User ID', '03f15da4-a316-4316-bffe-f5eceed78dd0'),
    userName: text('User Name', 'Jemimah Gellately'),
    userEmail: text('User Email', 'jgellately9@technorati.com'),
    userLanguages: ['sr-Latn-RS', 'en-US'],
    deviceType: '',
    browserName: text('Browser', 'Chromium'),
    browserVersion: text('Browser Version', '17'),
    osName: text('OS', 'Ubuntu'),
    osVersion: text('OS Version', '12.04'),
    windowHidden: false,
    windowWidth: 800,
    windowHeight: 600,
    latitude: number('Latitude', 51.5788648, {
      range: true,
      min: -180,
      max: 180,
      step: 1
    }),
    longitude: number('Longitude', 6.1597109, {
      range: true,
      min: -180,
      max: 180,
      step: 1
    }),
    accuracyRadius: -1,
    city: text('City', 'Kevelaer'),
    subdivision: text('Subdivision', 'North Rhine-Westphalia'),
    subdivisionCode: text('Subdivision Code', 'DE-NW'),
    country: text('Country', 'Germany'),
    countryCode: text('Country Code', 'DE'),
    continent: text('Continent', 'Europe'),
    continentCode: text('Continent Code', 'EU'),
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
