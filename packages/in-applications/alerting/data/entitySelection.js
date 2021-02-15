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
 * Creates the entity selection model expected by the backend.
 */
export function getEntitySelection(applicationId, serviceId = null, endpointId = null) {
  if (!serviceId && !endpointId) {
    return {
      [applicationId]: {
        applicationId,
        inclusive: true
      }
    };
  }

  if (!endpointId) {
    return {
      [applicationId]: {
        applicationId,
        inclusive: false,
        services: {
          [serviceId]: {
            serviceId,
            inclusive: true
          }
        }
      }
    };
  }

  return {
    [applicationId]: {
      applicationId,
      inclusive: false,
      services: {
        [serviceId]: {
          serviceId,
          inclusive: false,
          endpoints: {
            [endpointId]: {
              endpointId,
              inclusive: true
            }
          }
        }
      }
    }
  };
}

/**
 * Converts an App/Service/Endpoint selection into a QB2 query in FormModel format.
 * @param applications    App/Service/Endpoint selection to be converted.
 * @param boundaryScope   The boundary scope applied to all Applications.
 * @param applicationId   The applicationId, which is used as a fallback in case no applications selection
 *                        is provided, for backward compatibility to currently still existing UI logic.
 * @param applicationName Optional parameter, in which case we use e.g. application.name instead of application.id,
 *                        if provided, to generate more readable filters. Usually only used for UA-links, but not when
 *                        we generate the filters for a backend request.
 * @param serviceId       Optional parameter, in case we are only interested in one specific service of the entire
 *                        given selection.
 * @returns The FormModel of the resulting QB2 query.
 */
export function getEntitySelectionAsTagFilterFormModel(
  applications,
  boundaryScope,
  applicationId,
  applicationName,
  serviceId
) {
  if (isEmpty(applications)) {
    // backward compatibility only ever possible in case smartAlertsAdvancedEntitySelectionEnabled is disabled
    return getExplicitEntityTagFilterFormModel(boundaryScope, applicationId, applicationName, serviceId);
  }

  const application = applications[applicationId];
  if (serviceId) {
    if (serviceId in application.services) {
      const service = application.services[serviceId];
      return joinExpressions({
        logicalOperator: and,
        expressions: [
          getApplicationTagFilter(boundaryScope, applicationId, applicationName),
          getServiceTagFilterFormModel(service.serviceId, service.inclusive, service.endpoints, false)
        ]
      });
    }
    return getExplicitEntityTagFilterFormModel(boundaryScope, applicationId, applicationName, serviceId);
  }

  return getApplicationTagFilterFormModel(
    boundaryScope,
    applicationId,
    applicationName,
    application.inclusive,
    application.services
  );
}

function getExplicitEntityTagFilterFormModel(boundaryScope, applicationId, applicationName, serviceId) {
  if (serviceId) {
    return joinExpressions({
      logicalOperator: and,
      expressions: [
        getApplicationTagFilter(boundaryScope, applicationId, applicationName),
        getServiceIdTagFilter(serviceId, true)
      ]
    });
  }

  return [getApplicationTagFilter(boundaryScope, applicationId, applicationName)];
}

function getApplicationTagFilterFormModel(boundaryScope, applicationId, applicationName, inclusive, services) {
  const relevantServiceTagFilterFormModels =
    services &&
    Object.values(services)
      .filter(service => service.inclusive !== inclusive || hasAnyChildrenOfInclusionType(service, !inclusive))
      .map(service => getServiceTagFilterFormModel(service.serviceId, service.inclusive, service.endpoints, inclusive));

  const applicationFilter = getApplicationTagFilter(boundaryScope, applicationId, applicationName);

  if (isEmpty(relevantServiceTagFilterFormModels)) {
    return [applicationFilter];
  }

  if (inclusive) {
    return joinExpressions({
      logicalOperator: and,
      expressions: [applicationFilter, ...relevantServiceTagFilterFormModels]
    });
  }

  return joinExpressions({
    logicalOperator: and,
    expressions: [
      applicationFilter,
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

export function getApplicationIdTagFilter(boundaryScope, applicationId) {
  return tagFilter(
    boundaryScope === boundaryScopes.inbound ? 'boundary.application.id' : 'application.id',
    EQUALS,
    applicationId
  );
}

export function getApplicationNameTagFilter(boundaryScope, applicationName) {
  return tagFilter(
    boundaryScope === 'INBOUND' ? 'call.inbound_of_application' : 'application.name',
    EQUALS,
    applicationName
  );
}

function getApplicationTagFilter(boundaryScope, applicationId, applicationName) {
  return applicationName
    ? getApplicationNameTagFilter(boundaryScope, applicationName)
    : getApplicationIdTagFilter(boundaryScope, applicationId);
}
