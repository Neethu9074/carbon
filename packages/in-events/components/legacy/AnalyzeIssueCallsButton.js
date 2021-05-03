/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Button } from '@instana/components';

import {
  isApplicationEntity,
  isServiceEntity,
  isEndpointEntity,
  getEntityOfType,
  isLoading,
  hasErrors
} from 'in-services/entityUtils';
import { getTimeConfigFromEvent, getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { defaultGroupings as defaultApplicationGroupings } from 'in-applications/tags';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { createChartedMetric, createOrderBy } from 'in-analyze/navigation/paths';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import { containsIgnoreCase } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
    const formModel = getFormModel(isErroneous, isSynthetic);
    const hiddenCalls = isSynthetic ? { includeSynthetic: true } : null;
    const dataSource = 'calls';
    const groupBy = endpointName ? null : defaultApplicationGroupings[dataSource];
    const orderBy = getOrderBy(event, groupBy);
    const orderByGroups = getOrderByGroup(event, groupBy);
    const chartedMetrics = getChartedMetrics(event, groupBy);

    return (
      <Button
        className={className}
        kind="primary"
        icon="lib_application_call"
        href$={getLinkToAnalyze({
          applicationName,
          serviceName,
          endpointName,
          dataSource,
          formModel,
          hiddenCalls,
          groupBy,
          chartedMetrics,
          orderBy,
          orderByGroups,
          timeConfig: getTimeConfigFromEvent(event)
        })}
      >
        {t('in-events:analyzeCalls')}
      </Button>
    );
  }
);

function getOrderByGroup(event, groupBy) {
  return groupBy != null && isLatencyEvent(event) ? createOrderBy('latency_MEAN', 'DESC') : null;
}

function getOrderBy(event, groupBy) {
  return groupBy == null && isLatencyEvent(event) ? createOrderBy('latency', 'DESC') : null;
}

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

function getFormModel(isErroneous, isSynthetic) {
  let formModel = [];

  if (isErroneous) {
    formModel = joinExpressions({ expressions: [formModel, tagFilter('call.erroneous', EQUALS, true)] });
  }
  if (isSynthetic) {
    formModel = joinExpressions({ expressions: [formModel, tagFilter('call.is_synthetic', EQUALS, true)] });
  }

  return formModel;
}

function getChartedMetrics(event, groupBy) {
  if (groupBy == null || isLatencyEvent(event)) {
    return [createChartedMetric('latency', 'DISTRIBUTION')];
  }
  if (isErrorEvent(event)) {
    // use count metric also for error-rate, because we already filter for erroneous calls only
    return [createChartedMetric('erroneousCalls', 'SUM')];
  }
  return [createChartedMetric('calls', 'SUM')];
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
