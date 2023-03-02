/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';

// dashboards
export const websiteId = 'websiteId';
export const pageId = 'pageId';
export const errorId = 'errorId';
export const resourceId = 'resourceId';
export const resourceType = 'resourceType';
export const xhrId = 'xhrId';
export const customEventId = 'customEventId';

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

// page load view
export const pageLoadId = 'pageLoadId';
export const beaconId = 'beaconId';
export const beaconTimestamp = 'beaconTimestamp';

// alert view
export const alertId = 'alertId';
export const alertCreated = 'alertCreated';
