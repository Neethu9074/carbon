/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';

// analyze view
export const applicationId = 'appId';
export const serviceId = 'serviceId';
export const endpointId = 'endpointId';
export const expandId = 'expanded';
export const previewEnabled = 'previewEnabled';
export const showGraph = 'showGraph';
export const focusedMetric = 'focusedMetric';

// tags
export const tagFilter = 'tagFilter';

// groups
export const groupBy = 'groupBy';
export const dataSource = 'dataSource';
export const metrics = 'metrics';
export const serializeMetrics = buildJsonSerializer();
export const deserializeMetrics = buildJsonParser(null);

// order
export const orderBy = 'orderBy';
export const orderDirection = 'orderDirection';

// trace detail view
export const traceId = 'traceId';
export const callId = 'callId';
