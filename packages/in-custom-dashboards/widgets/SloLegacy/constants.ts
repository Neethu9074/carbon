/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { sloFullEnabled } from 'in-services/featureFlags';

export const isWebsiteSloEnabled = sloFullEnabled;

export const MonitoringSources = Object.freeze(['application', 'website'] as const);
export type MonitoringSource = (typeof MonitoringSources)[number];
