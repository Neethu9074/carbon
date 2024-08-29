/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { sloEnabled, websiteSloEnabled } from 'in-services/featureFlags';

export const isWebsiteSloEnabled = sloEnabled && websiteSloEnabled;

export const MonitoringSources = Object.freeze(['application', 'website'] as const);
export type MonitoringSource = (typeof MonitoringSources)[number];
