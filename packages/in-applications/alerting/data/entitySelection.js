/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { isEmpty } from 'lodash';

import { and, or } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS, NOT_EQUAL } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { boundaryScopes } from 'in-applications/constants';

/**
 * Converts an App/Service/Endpoint selection into a QB2 query in FormModel format.
 * @param applications  App/Service/Endpoint selection to be converted.
 * @param boundaryScope The boundary scope applied to all Applications.
 * @param applicationId The (deprecated) applicationId, which is used as a fallback in case no applications selection
 *                      is provided, for backward compatibility to currently still existing UI logic.
 * @param serviceId     Optional parameter, in case we are only interested in one specific service of the entire
 *                      given selection.
 * @returns The FormModel of the resulting QB2 query.
 */
export function getEntitySelectionAsTagFilterFormModel(applications, boundaryScope, applicationId, serviceId) {
  if (isEmpty(applications)) {
    return getExplicitEntityTagFilterFormModel(applicationId, boundaryScope, serviceId);
  }

  // as of now we only support a single selected application
  // TODO resolve this limitation as soon as we support Global SmartAlerts
  const [application] = Object.values(applications);
  if (serviceId) {
    if (serviceId in application.services) {
      const service = application.services[serviceId];
      return joinExpressions({
        logicalOperator: and,
        expressions: [
          getApplicationIdTagFilter(application.applicationId, boundaryScope),
          getServiceTagFilterFormModel(service.serviceId, service.inclusive, service.endpoints, false)
        ]
      });
    }
    return getExplicitEntityTagFilterFormModel(application.applicationId, boundaryScope, serviceId);
  }

  return getApplicationTagFilterFormModel(
    application.applicationId,
    boundaryScope,
    application.inclusive,
    application.services
  );
}

function getExplicitEntityTagFilterFormModel(applicationId, boundaryScope, serviceId) {
  if (serviceId) {
    return joinExpressions({
      logicalOperator: and,
      expressions: [getApplicationIdTagFilter(applicationId, boundaryScope), getServiceIdTagFilter(serviceId, true)]
    });
  }

  return [getApplicationIdTagFilter(applicationId, boundaryScope)];
}

function getApplicationTagFilterFormModel(applicationId, boundaryScope, inclusive, services) {
  const relevantServiceTagFilterFormModels =
    services &&
    Object.values(services)
      .filter(service => service.inclusive !== inclusive || hasAnyChildrenOfInclusionType(service, !inclusive))
      .map(service => getServiceTagFilterFormModel(service.serviceId, service.inclusive, service.endpoints, inclusive));

  if (isEmpty(relevantServiceTagFilterFormModels)) {
    return [getApplicationIdTagFilter(applicationId, boundaryScope)];
  }

  if (inclusive) {
    return joinExpressions({
      logicalOperator: and,
      expressions: [getApplicationIdTagFilter(applicationId, boundaryScope), ...relevantServiceTagFilterFormModels]
    });
  }

  return joinExpressions({
    logicalOperator: and,
    expressions: [
      getApplicationIdTagFilter(applicationId, boundaryScope),
      relevantServiceTagFilterFormModels.length === 1
        ? relevantServiceTagFilterFormModels[0]
        : joinExpressions({
            logicalOperator: or,
            expressions: relevantServiceTagFilterFormModels
          })
    ]
  });
}

function hasAnyChildrenOfInclusionType(service, included) {
  return service.endpoints && Object.values(service.endpoints).some(endpoint => endpoint.inclusive === included);
}

function getServiceTagFilterFormModel(serviceId, inclusive, endpoints, parentInclusive) {
  const relevantEndpointFilters =
    endpoints &&
    Object.values(endpoints)
      .filter(endpoint => endpoint.inclusive !== inclusive)
      .map(endpoint => getEndpointIdTagFilter(endpoint.endpointId, endpoint.inclusive));

  if (isEmpty(relevantEndpointFilters)) {
    return [getServiceIdTagFilter(serviceId, inclusive)];
  }

  if (inclusive) {
    if (parentInclusive) {
      const serviceFilter = getServiceIdTagFilter(serviceId, false);

      const notServiceOrNotEndpointTagFilterFormModels = relevantEndpointFilters.map(endpointFilter =>
        joinExpressions({
          logicalOperator: or,
          expressions: [serviceFilter, endpointFilter]
        })
      );

      return joinExpressions({
        logicalOperator: and,
        expressions: notServiceOrNotEndpointTagFilterFormModels
      });
    }

    return joinExpressions({
      logicalOperator: and,
      expressions: [getServiceIdTagFilter(serviceId, inclusive), ...relevantEndpointFilters]
    });
  }

  const singleEndpoint = relevantEndpointFilters.length === 1;
  return joinExpressions({
    logicalOperator: parentInclusive && singleEndpoint ? or : and,
    expressions: [
      getServiceIdTagFilter(serviceId, parentInclusive && !isEmpty(relevantEndpointFilters) ? inclusive : true),
      singleEndpoint
        ? relevantEndpointFilters[0]
        : joinExpressions({
            logicalOperator: or,
            expressions: relevantEndpointFilters
          })
    ]
  });
}

function getServiceIdTagFilter(serviceId, inclusive) {
  return tagFilter('service.id', inclusive ? EQUALS : NOT_EQUAL, serviceId);
}

function getEndpointIdTagFilter(endpointId, inclusive) {
  return tagFilter('endpoint.id', inclusive ? EQUALS : NOT_EQUAL, endpointId);
}

function getApplicationIdTagFilter(applicationId, boundaryScope) {
  return tagFilter(
    boundaryScope === boundaryScopes.inbound ? 'boundary.application.id' : 'application.id',
    EQUALS,
    applicationId
  );
}
