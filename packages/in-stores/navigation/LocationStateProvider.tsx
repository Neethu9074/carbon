/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// eslint-disable-next-line no-restricted-imports
import { useLocation as useRouterLocation } from 'react-router';
import React, { useContext, useEffect, useMemo } from 'react';

import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { emptyObject } from 'in-services/fixedObjects';
import { Location } from 'in-stores/navigation/types';
import { ineum } from 'in-services/tracking/ineum';

const LocationStateContext = React.createContext<Location>({
  pathname: '',
  query: emptyObject,
  matrix: emptyObject
});

// Synchronously set the page name to ensure that the page load beacon does carry the right page name.
ineum('page', window.location.pathname);

export default function LocationStateProvider({ children }: React.PropsWithChildren<{}>) {
  const routerLocation = useRouterLocation();
  // Re-parsing the location object here to be able to extract matrix parameters from location.pathname into Location.matrix
  const location = useMemo(() => transformLocation(routerLocation), [routerLocation]);

  // update eum state on location changes
  useEffect(() => ineum('page', location.pathname), [location]);

  return <LocationStateContext.Provider value={location}>{children}</LocationStateContext.Provider>;
}

export function useLocation(): Location {
  const location = useContext(LocationStateContext);
  return useMemo(() => cloneLocation(location), [location]);
}

/**
 * Ensures both the history location from vanilla react router, as well as the location from matrixAwareHistory are handled by LocationStateProvider
 * This is necessary, because react-routers useLocation will already handle matrix parameters while we use the custom matrixAwareHistory,
 * but support for this will be removed with the upgrade to react-router 6. At which point the quick return can be removed and this
 * function can be inlined into LocationStateProvider
 **/
function transformLocation(routerLocation: Location | ReturnType<typeof useRouterLocation>): Location {
  if (isMatrixLocation(routerLocation)) {
    return routerLocation;
  }
  return parseUrl(routerLocation.pathname + (routerLocation.search || ''));
}

function isMatrixLocation(location: Location | ReturnType<typeof useRouterLocation>): location is Location {
  return (location as Location).matrix !== undefined;
}
