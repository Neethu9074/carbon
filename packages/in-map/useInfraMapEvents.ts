/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useCallback, useEffect } from 'react';

//@ts-expect-error
import { clearSelectedSnapshotId } from 'in-stores/snapshot';
import { useClearSelectedEvent } from 'in-stores/navigation/paths/eventPaths';
import { useGoToDashboard } from 'in-stores/navigation/paths/dashboardPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { navigationParameters$ } from 'in-stores/navigation';
import { Location } from 'in-stores/navigation/types';

// eslint-disable-next-line no-restricted-imports
export const NAVIGATE_BACK_IN_INFRA_MAP_EVENT = 'navigateBackInInfraMap';
export const DOUBLE_CLICK_MAP_ENTITY = 'clickedInfraMapItem';
export const SEARCH_QUERY_UPDATED = 'searchQueryUpdated';

let navigationParameters: Location;
navigationParameters$.subscribe(_navigationParameters => (navigationParameters = _navigationParameters));

export default function useInfraMapEvents() {
  const clearSelectedEvent = useClearSelectedEvent();
  const { location, navigate } = useNavigation();
  const goToDashboard = useGoToDashboard();

  const handleInfraMapItemClick = useCallback(
    e => {
      goToDashboard(e.detail.dashboardId);
    },
    [goToDashboard]
  );

  const handleClearSelectedEvent = useCallback(() => {
    if (checkIfDashboardIsOpen()) {
      goToRootOfView(location, navigate);
      return;
    } else {
      clearSelectedEvent();
      clearSelectedSnapshotId(location, navigate);
    }
  }, [clearSelectedEvent, location, navigate]);

  const handleEscape = useCallback(
    event => {
      if (event.key !== 'Escape') {
        return;
      }
      handleClearSelectedEvent();
    },
    [handleClearSelectedEvent]
  );

  const handleQueryUpdate = useCallback(
    (event: CustomEvent<{ query: { query: string; notAlterURL?: boolean } }>) => {
      const { query } = event.detail;

      if (query?.notAlterURL) {
        return;
      }

      if (!query || !query.query || query.query.length === 1) {
        delete location.query.q;
      } else {
        location.query.q = query.query;
      }

      navigate(location);
    },
    [location, navigate]
  );

  useEffect(() => {
    window.addEventListener(DOUBLE_CLICK_MAP_ENTITY, handleInfraMapItemClick);
    return () => {
      window.removeEventListener(DOUBLE_CLICK_MAP_ENTITY, handleInfraMapItemClick);
    };
  }, [handleInfraMapItemClick]);

  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  useEffect(() => {
    window.addEventListener(NAVIGATE_BACK_IN_INFRA_MAP_EVENT, handleClearSelectedEvent);
    return () => {
      window.removeEventListener(NAVIGATE_BACK_IN_INFRA_MAP_EVENT, handleClearSelectedEvent);
    };
  }, [handleClearSelectedEvent]);

  useEffect(() => {
    window.addEventListener(SEARCH_QUERY_UPDATED, handleQueryUpdate as EventListener);
    return () => {
      window.removeEventListener(SEARCH_QUERY_UPDATED, handleQueryUpdate as EventListener);
    };
  }, [handleQueryUpdate]);

  return null;
}

function checkIfDashboardIsOpen() {
  return /.*\/dashboard\/?.*/i.test(navigationParameters.pathname);
}

export function goToRootOfView(location: Location, navigate: (target: Location, replace?: boolean) => void) {
  location.pathname = location.pathname.replace(/^\/([a-z]+)\/.*/i, (_, view) => `/${view}`);
  navigate(location);
}
