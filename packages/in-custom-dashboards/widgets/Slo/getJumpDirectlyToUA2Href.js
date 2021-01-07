import { combineLatest } from '@instana/observables';
import { get } from 'lodash';

import { joinExpressions, fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getDirectLinkToUA2 } from 'in-analyze/navigation/paths';
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

export default function getJumpDirectlyToUA2Href$(ids, tagFilterExpression, boundaryScope, additionalParams) {
  return getLabels(ids).flatMap(({ applicationName, serviceName, endpointName }) => {
    const tagFilterExpressionUiModel = fromBackendModel(tagFilterExpression);
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

    return getDirectLinkToUA2({
      dataSource: 'calls',
      ...additionalParams,
      tagFilterExpression: joinExpressions({
        expressions: [...entityFilters, tagFilterExpressionUiModel]
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
