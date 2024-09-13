/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useCallback } from 'react';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { urlQueryKeys, setTimeConfig } from 'in-stores/time/config';
import { graphPath } from 'in-stores/navigation/paths/mainPaths';
import { emptyObject } from 'in-services/fixedObjects';
import { Location } from 'in-stores/navigation/types';
import { TimeConfig } from 'in-types';

export const classicDashboard = '/dashboard';

interface GetDashboardLinkConfig {
  windowSize?: number;
  to?: number;
  focusedMoment?: number;
  pathname?: string;
  autoRefresh?: boolean;
  timeConfig?: TimeConfig;
}

interface GetLinkToSnapshotInCurrentViewConfig {
  timeConfig?: TimeConfig;
}

function getActiveView(params: Location) {
  return params.pathname.replace(/\/dashboard($|\/.*)/, '').replace(/^\//, '');
}

export const useGetDashboardLink = () => {
  const { location, createHref } = useNavigation();

  return useCallback(
    (
      snapshotId: string,
      { windowSize, to, focusedMoment, pathname, autoRefresh, timeConfig }: GetDashboardLinkConfig = {}
    ) => {
      if (pathname) {
        location.pathname = pathname;
      } else {
        const view = getActiveView(location);
        location.pathname = `/${view}${classicDashboard}`;
      }
      if (windowSize != null) {
        location.query[urlQueryKeys.windowSize] = String(windowSize);
      }
      if (to !== undefined) {
        location.query[urlQueryKeys.to] = to == null ? '' : String(to);
      }
      if (focusedMoment !== undefined) {
        location.query[urlQueryKeys.focusedMoment] = focusedMoment == null ? '' : String(focusedMoment);
      }
      if (autoRefresh !== undefined) {
        location.query[urlQueryKeys.autoRefresh] = String(Boolean(autoRefresh));
      }
      if (timeConfig) {
        setTimeConfig(location, timeConfig);
      }
      location.query.snapshotId = snapshotId;

      return createHref(location);
    },
    [createHref, location]
  );
};

export const useGoToDashboard = () => {
  const { navigate, location } = useNavigation();

  return (snapshotId: string) => {
    const view = getActiveView(location);
    location.query.snapshotId = snapshotId;
    location.pathname = `/${view}${classicDashboard}`;

    navigate(location);
  };
};

export const useGoToGraph = (snapshotId: string) => {
  const { location, createHref } = useNavigation();

  location.query.snapshotId = snapshotId;
  location.pathname = graphPath;
  return createHref(location);
};

export const useGetCloseDashboardLink = () => {
  const { location, createHref } = useNavigation();

  location.pathname = location.pathname.replace(/\/dashboard/i, '');

  return createHref(location);
};

export const useGetLinkToSnapshotInCurrentView = (
  snapshotId: string,
  { timeConfig }: GetLinkToSnapshotInCurrentViewConfig = emptyObject
) => {
  const { location, createHref } = useNavigation();

  location.query.snapshotId = snapshotId;

  if (timeConfig) {
    setTimeConfig(location, timeConfig);
  }

  return createHref(location);
};
