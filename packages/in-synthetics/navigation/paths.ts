/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';

export const syntheticsPath = '/syntheticTests';
export const syntheticLocationPath = '/syntheticLocations';
export const syntheticsDashboard = '/synthetic';
export const syntheticAlertListPath = `${syntheticsDashboard}/alerts`;
export const syntheticsSummaryPath = `${syntheticsDashboard}/summary`;
export const syntheticResultsListPath = `${syntheticsDashboard}/results`;
export const syntheticDetailsPath = `/syntheticDetails`;

export const isSyntheticMonitoringView = getRootPathPredicate(
  syntheticsPath,
  syntheticLocationPath,
  syntheticsDashboard,
  syntheticsSummaryPath,
  syntheticResultsListPath,
  syntheticDetailsPath
);
