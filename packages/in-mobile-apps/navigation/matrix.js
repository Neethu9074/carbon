/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';

// dashboards
export const mobileAppId = 'mobileAppId';
export const viewId = 'viewId';
export const httpRequestId = 'httpRequestId';

// analyze
export const tagFilters = 'tagFilters';
export const group = 'group';
export const beaconType = 'beaconType';
export const metrics = 'metrics';

export const serializeGroup = buildJsonSerializer();
export const deserializeGroup = buildJsonParser({ groupbyTag: 'beacon.location.path' });
export const serializeTagFilters = buildJsonSerializer();
export const deserializeTagFilters = buildJsonParser([]);
export const serializeMetrics = buildJsonSerializer();
export const deserializeMetrics = buildJsonParser(null);

// session view
export const sessionId = 'sessionId';
export const beaconId = 'beaconId';
export const beaconTimestamp = 'beaconTimestamp';
