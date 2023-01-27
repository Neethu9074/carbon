/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { boundaryScopes } from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/config';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { CONTAINS, EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';

export function createApplicationIdTagFilter(applicationId, boundaryScope) {
  let allCallsScope = boundaryScope === boundaryScopes.all;
  return tagFilter(
    allCallsScope ? 'application.id' : 'boundary.application.id',
    EQUALS,
    applicationId,
    null,
    allCallsScope ? DESTINATION : NOT_APPLICABLE
  );
}

export function createServiceIdTagFilter(serviceId) {
  return tagFilter('service.id', EQUALS, serviceId, null, DESTINATION);
}

export function createApplicationNameTagFilter(name) {
  return tagFilter('application.name', CONTAINS, name, null, DESTINATION);
}

export function createServiceNameTagFilter(name) {
  return tagFilter('service.name', CONTAINS, name, null, DESTINATION);
}

export function createEndpointNameTagFilter(name) {
  return tagFilter('endpoint.name', CONTAINS, name, null, DESTINATION);
}
