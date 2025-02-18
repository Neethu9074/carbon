/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';

import { ApplicationBoundaryScope, Result, TagFilter, TagFilterExpressionElementUnion } from '@instana/types';
import { combineLatest, Observable } from '@instana/observables';

import { joinExpressions, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { GetLinkToAnalyzeProps } from 'in-applications/navigation/paths';
import { alwaysNull } from 'in-services/fixedStreams';
import { Nullish } from 'in-types';

interface GetLabelsProps {
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
}

function getLabels({ applicationId, serviceId, endpointId }: GetLabelsProps): Observable<{
  applicationName: string | Nullish;
  serviceName: string | Nullish;
  endpointName: string | Nullish;
}> {
  return combineLatest([
    applicationId ? getApplication({ id: applicationId }).map(getLabel) : alwaysNull,
    serviceId ? getServiceLabel({ id: serviceId }).map(getLabel) : alwaysNull,
    endpointId ? getEndpointInfo({ id: endpointId }).map(getLabel) : alwaysNull
  ]).map(([applicationName, serviceName, endpointName]) => ({
    applicationName,
    serviceName,
    endpointName
  }));
}

function getLabel(result: Result<{ label: string }>): string | null {
  return get(result, ['data', 'label'], null);
}

export default function getJumpDirectlyToApplicationLikeUA2Href$(
  ids: GetLabelsProps,
  backendModel: TagFilterExpressionElementUnion,
  filters: TagFilter[] = [],
  boundaryScope: ApplicationBoundaryScope,
  additionalParams: { [key: string]: unknown },
  getLinkToApplicationAnalyze: (props: Partial<GetLinkToAnalyzeProps>) => string
): Observable<string> {
  return getLabels(ids).map(({ applicationName, serviceName, endpointName }): string => {
    const tagFilterFormModel = fromBackendModel(backendModel);
    const entityFilters: TagFilter[] = [];
    if (applicationName) {
      entityFilters.push(
        createEqualsTagFilter(
          boundaryScope === 'INBOUND' ? 'call.inbound_of_application' : 'application.name',
          applicationName
        )
      );
    }
    if (serviceName) {
      entityFilters.push(createEqualsTagFilter('service.name', serviceName));
    }
    if (endpointName) {
      entityFilters.push(createEqualsTagFilter('endpoint.name', endpointName));
    }

    return getLinkToApplicationAnalyze({
      dataSource: 'calls',
      ...additionalParams,
      formModel: joinExpressions({
        expressions: [...entityFilters, ...filters, tagFilterFormModel]
      })
    });
  });
}

function createEqualsTagFilter(name: string, value: string): TagFilter {
  return tagFilter(name, 'EQUALS', value, undefined, 'DESTINATION');
}
