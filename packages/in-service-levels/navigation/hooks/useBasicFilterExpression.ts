/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';

import {
  ApplicationSloEntity,
  BoundaryScope,
  isSyntheticSloEntity,
  Result,
  SyntheticSloEntity,
  TagFilter,
  TagFilterExpression,
  WebsiteSloEntity
} from '@instana/types';
import { combineLatest, just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { createTagFilterExpression } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { ENDPOINT, SERVICE, entityTypes } from 'in-analyze/applicationFilter';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { tagFilterForBoundaryScope } from 'in-analyze/navigation/paths';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { alwaysNull } from 'in-services/fixedStreams';

export interface UseBasicTagFilterExpressionProps {
  entity: ApplicationSloEntity | WebsiteSloEntity | SyntheticSloEntity;
  withLabels?: boolean;
}

export default function useBasicTagFilterExpression({
  entity,
  withLabels
}: UseBasicTagFilterExpressionProps): TagFilterExpression {
  const isSyntheticEntity = isSyntheticSloEntity(entity);
  const { tagFilterExpression } = entity;

  const basicTagFilter =
    useObservable(() => {
      if (isSyntheticEntity) return just([]);

      if (!withLabels) return just(getInternalIdTagFilter(entity));

      return getLabels(entity).map((labels: GetLabelsTagFilterExpressionProps) =>
        getLabelsTagFilter({ ...labels, ...entity })
      );
    }, [entity, withLabels]) ?? [];

  if (isSyntheticEntity) return emptyTagFilterExpression;
  if (tagFilterExpression) return createTagFilterExpression('AND', [...basicTagFilter, tagFilterExpression]);

  return createTagFilterExpression('AND', basicTagFilter);
}

interface GetLabelsTagFilterExpressionProps extends LabelsResult {
  boundaryScope?: BoundaryScope;
}

function getLabelsTagFilter({
  applicationName,
  serviceName,
  endpointName,
  websiteName,
  boundaryScope = 'ALL'
}: GetLabelsTagFilterExpressionProps): TagFilter[] {
  const expressions = [];

  if (applicationName !== undefined) {
    expressions.push(tagFilterForBoundaryScope(boundaryScope, applicationName));
  }

  if (serviceName !== undefined) {
    expressions.push(tagFilter(SERVICE.name, EQUALS, serviceName, undefined, entityTypes.DESTINATION));
  }

  if (endpointName !== undefined) {
    expressions.push(tagFilter(ENDPOINT.name, EQUALS, endpointName, undefined, entityTypes.DESTINATION));
  }

  if (websiteName !== undefined) {
    expressions.push(tagFilter('beacon.website.name', EQUALS, websiteName));
  }

  return expressions;
}

function getInternalIdTagFilter({ applicationId, endpointId, serviceId, websiteId }: GetLabelsProps): TagFilter[] {
  const expressions = [];

  if (applicationId) {
    expressions.push(tagFilter('application.id', EQUALS, applicationId, undefined, entityTypes.DESTINATION));
  }

  if (endpointId) {
    expressions.push(tagFilter('endpoint.id', EQUALS, endpointId, undefined, entityTypes.DESTINATION));
  }

  if (serviceId) {
    expressions.push(tagFilter('service.id', EQUALS, serviceId, undefined, entityTypes.DESTINATION));
  }

  if (websiteId) {
    expressions.push(tagFilter('beacon.website.id', EQUALS, websiteId, undefined, entityTypes.NOT_APPLICABLE));
  }

  return expressions;
}

interface GetLabelsProps {
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
  websiteId?: string;
}

interface LabelsResult {
  applicationName?: string;
  serviceName?: string;
  endpointName?: string;
  websiteName?: string;
}

function getLabels({ applicationId, serviceId, endpointId, websiteId }: GetLabelsProps): Observable<LabelsResult> {
  return combineLatest([
    applicationId ? getApplication({ id: applicationId }).map(getLabel) : alwaysNull,
    serviceId ? getServiceLabel({ id: serviceId }).map(getLabel) : alwaysNull,
    endpointId ? getEndpointInfo({ id: endpointId }).map(getLabel) : alwaysNull,
    websiteId ? getWebsite({ id: websiteId }).map(getLabel) : alwaysNull
  ]).map(([applicationName, serviceName, endpointName, websiteName]) => ({
    applicationName: applicationName ?? undefined,
    serviceName: serviceName ?? undefined,
    endpointName: endpointName ?? undefined,
    websiteName: websiteName ?? undefined
  }));
}

function getLabel(result: Result<{ label: string }>): string | null {
  return get(result, ['data', 'label'], null);
}
