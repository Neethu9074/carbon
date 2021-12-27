/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { stringify } from 'in-stores/navigation/routing/stringifier';
import { parseUrl } from 'in-stores/navigation/routing/parser';

/** creates a new url based on given location, without q= query parameter */
export function urlWithoutQueryParameter(location: string): string {
  const filteredLoc = parseUrl(location);
  if (filteredLoc?.query?.q) {
    delete filteredLoc.query.q;
  }
  return stringify(filteredLoc);
}
