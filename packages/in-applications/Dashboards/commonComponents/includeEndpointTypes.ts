/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { EndpointType, TagFilter } from 'in-types';

export function filterByEndpointType(types: EndpointType[]): TagFilter[] {
  if (types?.length === 1) {
    return [tagFilter('call.type', EQUALS, types[0])];
  } else {
    return [];
  }
}
