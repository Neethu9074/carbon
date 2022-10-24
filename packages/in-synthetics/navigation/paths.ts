/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';

export const syntheticsPath = '/syntheticTests';
export const syntheticLocationPath = '/syntheticLocations';
export const syntheticsDashboard = '/synthetic';
export const syntheticsSummaryPath = `${syntheticsDashboard}/summary`;
export const syntheticResultsListPath = `${syntheticsDashboard}/results`;
export const syntheticDetailsPath = `/details`;

export const isSyntheticMonitoringView = getRootPathPredicate(
  syntheticsPath,
  syntheticLocationPath,
  syntheticsDashboard,
  syntheticsSummaryPath,
  syntheticResultsListPath,
  syntheticDetailsPath
);
