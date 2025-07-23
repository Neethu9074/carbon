/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEmpty } from 'lodash';

import { ApplicationNode, BoundaryScope, EndpointNode, ServiceNode, TagFilter, TagFilterEntity } from '@instana/types';

import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { and, or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { boundaryScopes } from 'in-applications/constants';

/**
 * Creates the entity selection model expected by the backend.
 */
export function getEntitySelection<Id extends string>(
  applicationId: Id,
  serviceId?: string,
  endpointId?: string
): Record<string, ApplicationNode> {
  if (!serviceId && !endpointId) {
    return {
      [applicationId]: {
        applicationId,
        inclusive: true,
        services: {}
      }
    };
  }

  if (serviceId && !endpointId) {
    return {
      [applicationId]: {
        applicationId,
        inclusive: false,
        services: {
          [serviceId]: {
            serviceId,
            inclusive: true,
            endpoints: {}
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
        [serviceId!]: {
          serviceId: serviceId!,
          inclusive: false,
          endpoints: {
            [endpointId!]: {
              endpointId: endpointId!,
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
 * @param endpointId      Optional parameter, in case we are only interested in one specific endpoint of the entire
 *                        given selection.
 * @returns The FormModel of the resulting QB2 query.
 */
export function getEntitySelectionAsTagFilterFormModel(
  applications: Record<string, ApplicationNode>,
  boundaryScope: BoundaryScope,
  applicationId: string,
  applicationName?: string,
  serviceId?: string,
  endpointId?: string
): FormModelElement[] {
  const application = applications[applicationId];

  if (application && serviceId) {
    if (serviceId in application.services) {
      const service = application.services[serviceId];

      if (endpointId) {
        return joinExpressions({
          logicalOperator: and,
          expressions: [
            getApplicationTagFilter(boundaryScope, applicationId, applicationName),
            getServiceTagFilterFormModel(service.serviceId, service.inclusive, service.endpoints, false),
            getEndpointIdTagFilter(endpointId, true)
          ]
        });
      }

      return joinExpressions({
        logicalOperator: and,
        expressions: [
          getApplicationTagFilter(boundaryScope, applicationId, applicationName),
          getServiceTagFilterFormModel(service.serviceId, service.inclusive, service.endpoints, false)
        ]
      });
    }
    return getExplicitEntityTagFilterFormModel(boundaryScope, applicationId, applicationName, serviceId, endpointId);
  }

  // at this point, we make the assumption that we would have an endpointId always together with a serviceId and applicationId
  // so we have the logic above and could ignore handling endpointId here.
  // In a follow-up this could easily be extended to me more accurate to the
  // documentation of this method above.
  if (application) {
    return getApplicationTagFilterFormModel(
      boundaryScope,
      applicationId,
      applicationName,
      application.inclusive,
      application.services
    );
  }

  const applicationArray = Object.values(applications);
  return joinExpressions({
    logicalOperator: or,
    expressions: applicationArray.map(app => {
      return getApplicationTagFilterFormModel(boundaryScope, app.applicationId, undefined, app.inclusive, app.services);
    })
  });
}

function getExplicitEntityTagFilterFormModel(
  boundaryScope: BoundaryScope,
  applicationId: string,
  applicationName?: string,
  serviceId?: string,
  endpointId?: string
): FormModelElement[] {
  if (serviceId && endpointId) {
    return joinExpressions({
      logicalOperator: and,
      expressions: [
        getApplicationTagFilter(boundaryScope, applicationId, applicationName),
        getServiceIdTagFilter(serviceId, true),
        getEndpointIdTagFilter(endpointId, true)
      ]
    });
  }
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

function getApplicationTagFilterFormModel(
  boundaryScope: BoundaryScope,
  applicationId: string,
  applicationName?: string,
  inclusive?: boolean,
  services?: Record<string, ServiceNode>
): FormModelElement[] {
  const relevantServiceTagFilterFormModels =
    services &&
    Object.values(services)
      .filter(service => service.inclusive !== inclusive || hasAnyChildrenOfInclusionType(service, !inclusive))
      .map(service => getServiceTagFilterFormModel(service.serviceId, service.inclusive, service.endpoints, inclusive));

  const applicationFilter = getApplicationTagFilter(boundaryScope, applicationId, applicationName);

  if (!relevantServiceTagFilterFormModels || isEmpty(relevantServiceTagFilterFormModels)) {
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

function hasAnyChildrenOfInclusionType(service: ServiceNode, included: boolean): boolean {
  return service.endpoints && Object.values(service.endpoints).some(endpoint => endpoint.inclusive === included);
}

function getServiceTagFilterFormModel(
  serviceId: string,
  inclusive: boolean,
  endpoints?: Record<string, EndpointNode>,
  parentInclusive?: boolean
): FormModelElement[] {
  const relevantEndpointFilters =
    endpoints &&
    Object.values(endpoints)
      .filter(endpoint => endpoint.inclusive !== inclusive)
      .map(endpoint => getEndpointIdTagFilter(endpoint.endpointId, endpoint.inclusive));

  if (!relevantEndpointFilters || isEmpty(relevantEndpointFilters)) {
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

function getServiceIdTagFilter(serviceId: string, inclusive: boolean): TagFilter {
  return tagFilter('service.id', inclusive ? EQUALS : NOT_EQUAL, serviceId, null, DESTINATION);
}

function getEndpointIdTagFilter(endpointId: string, inclusive: boolean): TagFilter {
  return tagFilter('endpoint.id', inclusive ? EQUALS : NOT_EQUAL, endpointId, null, DESTINATION);
}

export function getApplicationIdTagFilter(boundaryScope: BoundaryScope, applicationId: string): TagFilter {
  return tagFilter(
    boundaryScope === boundaryScopes.inbound ? 'boundary.application.id' : 'application.id',
    EQUALS,
    applicationId,
    null,
    tagFilterEntity(boundaryScope)
  );
}

export function getApplicationNameTagFilter(boundaryScope: BoundaryScope, applicationName: string): TagFilter {
  return tagFilter(
    boundaryScope === 'INBOUND' ? 'call.inbound_of_application' : 'application.name',
    EQUALS,
    applicationName,
    null,
    tagFilterEntity(boundaryScope)
  );
}

function tagFilterEntity(boundaryScope: BoundaryScope): TagFilterEntity {
  return boundaryScope === boundaryScopes.inbound ? NOT_APPLICABLE : DESTINATION;
}

function getApplicationTagFilter(
  boundaryScope: BoundaryScope,
  applicationId: string,
  applicationName?: string
): TagFilter {
  return applicationName
    ? getApplicationNameTagFilter(boundaryScope, applicationName)
    : getApplicationIdTagFilter(boundaryScope, applicationId);
}

export function firstApplicationId(applications?: Record<string, ApplicationNode>): string | undefined {
  return applications && Object.values(applications)[0]?.applicationId;
}

export function hasSubEntitySelection(applications?: Record<string, ApplicationNode>): boolean {
  return Object.values(applications ?? {}).some(({ services }) => !isEmpty(services));
}

export function resetEntitySelection(
  isGlobalSmartAlert: boolean,
  applications: Record<string, ApplicationNode>
): Record<string, ApplicationNode> {
  if (isGlobalSmartAlert) {
    return {};
  }

  const applicationId = Object.keys(applications)[0];
  return {
    [applicationId]: {
      applicationId,
      inclusive: true,
      services: {}
    }
  };
}
