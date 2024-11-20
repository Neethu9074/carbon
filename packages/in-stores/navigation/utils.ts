/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { isEventsPath, isInfrastructurePath, isVulnerabilityPath } from 'in-stores/navigation/paths/mainPaths';
import { Location } from 'in-stores/navigation/types';

export type IsViewPredicate = (path: string) => boolean;
export type IsViewArg = string | IsViewPredicate;

export function removeDFQueryFromLocationWhenChangingArea(location: Location, path: string): Location {
  const { pathname: currentPath } = location;
  if (
    (location.query.q &&
      // delete the DF query when
      // * navigation from an infrastructure view (map, table) to another, non-infrastructure view, or the other way around or
      // * navigating from an events-page to any other page, or the other way around
      (isInfrastructurePath(path) !== isInfrastructurePath(currentPath) ||
        isEventsPath(path) !== isEventsPath(currentPath))) ||
    isVulnerabilityPath(path) !== isVulnerabilityPath(currentPath)
  ) {
    delete location.query.q;
  }
  return location;
}
