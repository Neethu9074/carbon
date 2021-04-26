/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';
import { get } from 'lodash';

import { joinExpressions, fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import { alwaysNull } from 'in-services/fixedStreams';

function getLabels({ applicationId, serviceId, endpointId }) {
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

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

export default function getJumpDirectlyToUA2Href$(ids, formModel, filters = [], boundaryScope, additionalParams) {
  return getLabels(ids).flatMap(({ applicationName, serviceName, endpointName }) => {
    const tagFilterFormModel = fromBackendModel(formModel);
    const entityFilters = [];
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

    return getLinkToAnalyze({
      dataSource: 'calls',
      ...additionalParams,
      formModel: joinExpressions({
        expressions: [...entityFilters, ...filters, tagFilterFormModel]
      })
    });
  });
}

function createEqualsTagFilter(name, value) {
  return {
    type: 'TAG_FILTER',
    name,
    operator: 'EQUALS',
    value
  };
}
