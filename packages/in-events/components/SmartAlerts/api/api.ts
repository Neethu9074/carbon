/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  ApplicationAlertStats,
  InfraAlertStats,
  LogAlertStats,
  MobileAppAlertStats,
  Result,
  SyntheticAlertStats,
  WebsiteAlertStats
} from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetAlertConfigStatsRequest {}

interface GetApplicationAlertConfigStatsResponse extends Result<ApplicationAlertStats> {}
interface GetWebsiteAlertConfigStatsResponse extends Result<WebsiteAlertStats> {}
interface GetMobileAppAlertConfigStatsResponse extends Result<MobileAppAlertStats> {}
interface GetInfraAlertConfigStatsResponse extends Result<InfraAlertStats> {}
interface GetSyntheticAlertConfigStatsResponse extends Result<SyntheticAlertStats> {}
interface GetLogAlertConfigStatsResponse extends Result<LogAlertStats> {}

// Get count of Global and local Application smart alerts
export const getApplicationAlertConfigStats = createResultSubscriptionFactory<
  GetAlertConfigStatsRequest,
  GetApplicationAlertConfigStatsResponse
>({
  eventId: 'getApplicationAlertConfigStats',
  trackSubscriptionStatistics: true
});

// Get count of Website smart alerts
export const getWebsiteAlertConfigStats = createResultSubscriptionFactory<
  GetAlertConfigStatsRequest,
  GetWebsiteAlertConfigStatsResponse
>({
  eventId: 'getWebsiteAlertConfigStats',
  trackSubscriptionStatistics: true
});

// Get count of Mobile-app smart alerts
export const getMobileAppAlertConfigStats = createResultSubscriptionFactory<
  GetAlertConfigStatsRequest,
  GetMobileAppAlertConfigStatsResponse
>({
  eventId: 'getMobileAppAlertConfigStats',
  trackSubscriptionStatistics: true
});

// Get count of Infra smart alerts
export const getInfraAlertConfigStats = createResultSubscriptionFactory<
  GetAlertConfigStatsRequest,
  GetInfraAlertConfigStatsResponse
>({
  eventId: 'getInfraAlertConfigStats',
  trackSubscriptionStatistics: true
});

// Get count of Synthetic smart alerts
export const getSyntheticAlertConfigStats = createResultSubscriptionFactory<
  GetAlertConfigStatsRequest,
  GetSyntheticAlertConfigStatsResponse
>({
  eventId: 'getSyntheticAlertConfigStats',
  trackSubscriptionStatistics: true
});

// Get count of Logs smart alerts
export const getLogAlertConfigStats = createResultSubscriptionFactory<
  GetAlertConfigStatsRequest,
  GetLogAlertConfigStatsResponse
>({
  eventId: 'getLogAlertConfigStats',
  trackSubscriptionStatistics: true
});
