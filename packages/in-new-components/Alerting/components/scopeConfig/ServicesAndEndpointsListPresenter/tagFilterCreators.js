/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { boundaryScopes } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import { CONTAINS, EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';

export function createApplicationIdTagFilter(applicationId, boundaryScope) {
  return tagFilter(
    boundaryScope === boundaryScopes.all ? 'application.id' : 'boundary.application.id',
    EQUALS,
    applicationId
  );
}

export function createServiceIdTagFilter(serviceId) {
  return tagFilter('service.id', EQUALS, serviceId);
}

export function createServiceNameTagFilter(name) {
  return tagFilter('service.name', CONTAINS, name);
}

export function createEndpointNameTagFilter(name) {
  return tagFilter('endpoint.name', CONTAINS, name);
}
