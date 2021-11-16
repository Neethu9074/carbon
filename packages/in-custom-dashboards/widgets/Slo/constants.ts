/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export const MonitoringSources = ['application', 'website'] as const;
export type MonitoringSource = typeof MonitoringSources[number];
