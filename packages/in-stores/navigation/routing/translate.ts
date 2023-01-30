/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { stringify } from 'in-stores/navigation/routing/stringifier';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { emptyObject } from 'in-services/fixedObjects';
import { Location } from 'in-stores/navigation/types';

export default function translate(targetLocation: string | Location, currentLocation?: Location): string {
  const location: Partial<Location> = currentLocation || emptyObject;

  // Pushing as string is supported in the history module. We will always normalize
  // to a location object, because we need to account for pushing strings without
  // query or matrix data.
  if (typeof targetLocation === 'string') {
    targetLocation = parseUrl(targetLocation);
  }

  return stringify({
    pathname: targetLocation.pathname || location.pathname || '',
    query: targetLocation.query || location.query || emptyObject,
    matrix: targetLocation.matrix || location.matrix || emptyObject
  });
}
