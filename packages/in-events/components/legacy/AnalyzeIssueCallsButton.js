import { get } from 'lodash';
import React from 'react';

import {
  isApplicationEntity,
  isServiceEntity,
  isEndpointEntity,
  getEntityOfType,
  isLoading,
  hasErrors
} from 'in-services/entityUtils';
import { getTimeConfigFromEvent, getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { containsIgnoreCase } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ event }) => {
    const observables = {};
    const entityType = event.get('entityType');
    if (isEndpointEntity(entityType)) {
      // We would not need to subscribe to any observable here if it weren't for the endpoint's `synthetic` flag, which
      // is not available from the event's meta data. We fetch the endpoint entity from the back end (possibly hitting
      // appdata-reader) just for this one boolean flag.
      observables.endpointEntity = getEntityObservable(event);
    }
    return observables;
  },
  function AnalyzeIssueCalls({ className, event, endpointEntity }) {
    const tagCatalog = useTagCatalog(getTagCatalog);
    if (!event) {
      return null;
    }

    const entityType = event.get('entityType');
    let applicationName = null;
    let serviceName = null;
    let endpointName = null;

    if (isApplicationEntity(entityType)) {
      applicationName = event.has('metadata') && event.get('metadata').get('entityLabel');
    } else if (isServiceEntity(entityType)) {
      serviceName = event.has('metadata') && event.get('metadata').get('entityLabel');
    } else if (isEndpointEntity(entityType)) {
      endpointName = event.has('metadata') && event.get('metadata').get('entityLabel');
      serviceName = event.has('metadata') && event.get('metadata').get('app20EndpointServiceLabel');
    }

    if (!applicationName && !serviceName && !endpointName) {
      return null;
    }

    const isErroneous = isErrorEvent(event);
    const isSynthetic = endpointEntity && isSyntheticEndpoint(endpointEntity);
    const filters = getFilters(isErroneous, isSynthetic);
    const dataSource = 'calls';
    const groupByTag = endpointName ? {} : getConfigByDataSource(dataSource).defaultGrouping;
    const order = getAnalyzeOrder(event);

    return (
      <Button
        className={className}
        kind="primary"
        icon="lib_application_call"
        href$={
          tagCatalog &&
          getLinkToAnalyze({
            applicationName,
            serviceName,
            endpointName,
            dataSource,
            filters,
            tagCatalog,
            groupByTag,
            orderBy: order.by,
            orderDirection: order.direction,
            timeConfig: getTimeConfigFromEvent(event)
          })
        }
      >
        Analyze Calls
      </Button>
    );
  }
);

function getEntityObservable(event) {
  const entityId = event.get('entityId');
  const entityType = event.get('entityType');
  const timeConfigFromEvent = getTimeConfigFromEventForSnapshotRetrieval(event);
  return getEntityOfType(entityId, entityType, timeConfigFromEvent).entity;
}

function isSyntheticEndpoint(endpoint) {
  if (!endpoint || isLoading(endpoint) || hasErrors(endpoint)) {
    return false;
  }

  return get(endpoint, ['data', 'synthetic'], false);
}

function getFilters(isErroneous, isSynthetic) {
  const filters = [];

  if (isErroneous) {
    filters.push({ name: 'call.erroneous', value: 'true' });
  }
  if (isSynthetic) {
    filters.push({ name: 'call.is_synthetic', value: 'true' });
  }

  return filters;
}

function getAnalyzeOrder(event) {
  let orderBy;
  let orderDirection;
  const entityType = event.get('entityType');
  if (isLatencyEvent(event)) {
    orderBy = isEndpointEntity(entityType) ? 'latency' : 'latency_MEAN_Agg';
    orderDirection = 'DESC';
  }
  return {
    by: orderBy,
    direction: orderDirection
  };
}

function isErrorEvent(event) {
  return containsMetricInEvent(event, 'error');
}

function isLatencyEvent(event) {
  return containsMetricInEvent(event, 'duration');
}

function containsMetricInEvent(event, metricNamePart) {
  const metricsList = event.getIn(['metadata', 'metrics'], []);
  if (metricsList) {
    return metricsList.filter(item => containsIgnoreCase(item.get('metricName', ''), metricNamePart)).size > 0;
  }

  return false;
}
