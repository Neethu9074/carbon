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
import {
  getTimeConfigFromEvent,
  getTimeConfigFromEventForSnapshotRetrieval
} from 'in-views/eventView/services/timeframe';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { containsIgnoreCase } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './AnalyzeIssueCallsButton.mless';

export default connectTo(
  ({ event }) => {
    const observables = {};
    const entityType = event.get('entityType');
    if (isEndpointEntity(entityType)) {
      // We would not need to subscribe to any observable here if it weren't for the endpoint's `synthetic` flag, which
      // is not available from the event's meta data. We fetch the endpoint entity from the back end (possibly hitting
      // appdata-reader) just for this one boolean flag.
      const endpointEntity = getEntityObservable(event);
      observables.endpointEntity = endpointEntity;
    }
    return observables;
  },
  function AnalyzeIssueCalls({ event, endpointEntity }) {
    if (!event) {
      return null;
    }

    const entityType = event.get('entityType');
    let applicationLabel = null;
    let serviceLabel = null;
    let endpointLabel = null;

    if (isApplicationEntity(entityType)) {
      applicationLabel = event.has('metadata') && event.get('metadata').get('entityLabel');
    } else if (isServiceEntity(entityType)) {
      serviceLabel = event.has('metadata') && event.get('metadata').get('entityLabel');
    } else if (isEndpointEntity(entityType)) {
      endpointLabel = event.has('metadata') && event.get('metadata').get('entityLabel');
      serviceLabel = event.has('metadata') && event.get('metadata').get('app20EndpointServiceLabel');
    }

    if (!applicationLabel && !serviceLabel && !endpointLabel) {
      return null;
    }

    const isErroneous = isErrorEvent(event);
    const isSynthetic = endpointEntity && isSyntheticEndpoint(endpointEntity);
    const filters = getFilters(isErroneous, isSynthetic);
    const order = getAnalyzeOrder(event);
    const dataSource = 'calls';

    return (
      <div className={locals.buttonWrapper}>
        <Button
          kind="primary"
          icon="lib_application_call"
          href$={getLinkToAnalyze({
            applicationName: applicationLabel,
            serviceName: serviceLabel,
            endpointName: endpointLabel,
            dataSource: dataSource,
            filters: filters,
            groupByTag: endpointLabel ? {} : getConfigByDataSource(dataSource).defaultGrouping,
            orderBy: order.by,
            orderDirection: order.direction,
            timeConfig: getTimeConfigFromEvent(event)
          })}
        >
          Analyze Calls
        </Button>
      </div>
    );
  }
);

function getEntityObservable(event) {
  const entityId = event.get('entityId');
  const entityType = event.get('entityType');
  const timeConfigFromEvent = getTimeConfigFromEventForSnapshotRetrieval(event);
  return getEntityOfType(entityId, entityType, timeConfigFromEvent).entity;
}

function isErrorEvent(event) {
  const problemText = getProblemTextOrEmpty(event);
  return containsIgnoreCase(problemText, 'error');
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
  const problemText = getProblemTextOrEmpty(event);
  if (containsIgnoreCase(problemText, 'latency')) {
    orderBy = isEndpointEntity(entityType) ? 'latency' : 'latencyAgg';
    orderDirection = 'DESC';
  }
  return {
    by: orderBy,
    direction: orderDirection
  };
}

function getProblemTextOrEmpty(event) {
  const problem = event.get('problem');
  if (problem) {
    const problemText = problem.get('problemText');
    return problemText ? problemText : '';
  }
}
