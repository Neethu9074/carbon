import { just } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import {
  getTimeConfigFromEvent,
  getTimeConfigFromEventForSnapshotRetrieval
} from 'in-views/eventView/services/timeframe';
import { getEntityOfType, isLoading, hasErrors } from 'in-components/EntityInformation/entityUtils';
import getEndpointLabel from 'in-subscription/application/getEndpointLabel';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
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
    const entityId = event.get('entityId');

    if (entityType === 'App20') {
      observables.applicationLabel = getApplication({ id: entityId }).map(getLabel);
    } else if (entityType === 'Service20') {
      observables.serviceLabel = getServiceLabel({ id: entityId }).map(getLabel);
    } else if (entityType === 'Endpoint20') {
      observables.endpointLabel = getEndpointLabel({ id: entityId }).map(getLabel);
      const endpointEntity = getEntityObservable(event);
      observables.serviceLabel = endpointEntity.flatMap(endpoint => {
        if (!endpoint || isLoading(endpoint) || hasErrors(endpoint)) {
          return just(null);
        }
        return getServiceLabel({ id: endpoint.data.serviceId }).map(getLabel);
      });
    }

    return observables;
  },
  function AnalyzeIssueCalls({ event, applicationLabel, serviceLabel, endpointLabel }) {
    if (!event) {
      return null;
    }

    if (!applicationLabel && !serviceLabel && !endpointLabel) {
      return null;
    }

    const isErroneous = isErrorEvent(event);
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
            filters: isErroneous ? [{ name: 'call.erroneous', value: 'true' }] : null,
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

function getAnalyzeOrder(event) {
  let orderBy;
  let orderDirection;
  const problemText = getProblemTextOrEmpty(event);
  if (containsIgnoreCase(problemText, 'latency')) {
    orderBy = 'latency';
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

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
