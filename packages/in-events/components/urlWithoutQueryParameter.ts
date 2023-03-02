/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { stringify } from 'in-stores/navigation/routing/stringifier';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { Location } from 'in-stores/navigation/types';

/** creates a new url based on given location, without q= query parameter */
export function urlWithoutQueryParameter(location: string): string {
  const filteredLoc = locationWithoutQueryParameter(parseUrl(location));
  return stringify(filteredLoc);
}

/** creates a new location based on given location, without q= query parameter */
export function locationWithoutQueryParameter(location: Location): Location {
  const cleanedLocation = cloneLocation(location);
  if (cleanedLocation?.query?.q) {
    delete cleanedLocation.query.q;
  }
  return cleanedLocation;
}
