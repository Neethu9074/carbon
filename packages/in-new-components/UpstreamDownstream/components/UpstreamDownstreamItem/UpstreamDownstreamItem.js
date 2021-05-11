/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Li } from '@instana/components';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { getServiceDashboard, getApplicationDashboard } from 'in-applications/navigation/paths';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import EntityWithIcon from 'in-new-components/EntityWithIcon';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './UpstreamDownstreamItem.mless';

export default connectTo(({ applicationId, serviceId, endpointId }) => {
  const observables = {};
  if (applicationId) {
    observables.applicationLabel = getApplication({ id: applicationId }).map(getLabel);
  }
  if (serviceId) {
    observables.serviceLabel = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  if (endpointId) {
    observables.endpointLabel = getEndpointInfo({ id: endpointId }).map(getLabel);
  }
  return observables;
})(function UpstreamDownstreamItem({
  applicationBoundaryScope,
  item,
  itemId,
  itemLabel,
  result,
  selectedMetric,
  timeConfig,
  itemType
}) {
  const maxSeverity = get(item, ['metrics', 'maxSeverity', 0, 1]);
  const technologies = item?.service?.technologies;
  const technologiesNoK8s = technologies?.filter(s => !s.startsWith('kubernetes'));

  return (
    <Li
      href$={
        itemId === 'ROOT' || itemId === 'UNKNOWN' ? null : dashboardLink(itemType, itemId, applicationBoundaryScope)
      }
      noAlternatingBg
    >
      <div className={locals.itemWrapper}>
        <div className={locals.entityWrapper}>
          {maxSeverity !== 0 ? (
            <HealthDot className={locals.dot} severity={maxSeverity} iconSize={8} />
          ) : (
            <div className={locals.dot} />
          )}
          <EntityWithIcon
            icon={itemType === relationships.SERVICE ? relationships.SERVICE_ICON : relationships.APPLICATION_ICON}
            label={itemLabel}
            rootOrUnknown={itemId === 'ROOT' || itemId === 'UNKNOWN'}
            technologies={technologiesNoK8s}
          />
          {itemId != 'ROOT' && itemId != 'UNKNOWN' && (
            <EndpointTypeBadgeList
              types={item.service ? item.service.types.filter(type => type !== 'UNDEFINED') : []}
            />
          )}
        </div>
        <div className={locals.chartWrapper}>
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            aggregation="SUM"
            metrics={item.metrics.calls}
            metric={item.metrics.callsAgg}
            tooltipFormatter={number.compact}
            label="Calls"
          />
          <div className={locals.chartItemWrapper}>
            {selectedMetric === 'callsAndlatency' ? (
              <SparkChart
                loading={result?.progress?.loading}
                rollup={getSparkChartGranularity(timeConfig)}
                timeConfig={getResolvedTimeConfig(timeConfig, result)}
                aggregation="MEAN"
                metrics={item.metrics.latency}
                metric={item.metrics.latencyAgg}
                tooltipFormatter={meanLatencyFixed.compact}
                label="Latency"
              />
            ) : (
              <SparkChart
                loading={result?.progress?.loading}
                rollup={getSparkChartGranularity(timeConfig)}
                timeConfig={getResolvedTimeConfig(timeConfig, result)}
                aggregation="SUM"
                metrics={item.metrics.erroneousCalls}
                metric={item.metrics.erroneousCallsAgg}
                tooltipFormatter={number.compact}
                label="Erroneous Calls"
                companionMetric={item.metrics.errorsAgg}
                companionMetricLabel={t('in-new-components:upstreamDownstream.companionMetricLabelErroneousCallRate')}
                companionMetricFormatter={percentage.detailed}
                companionAggregation="MEAN"
              />
            )}
          </div>
        </div>
      </div>
    </Li>
  );
});

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

function dashboardLink(itemType, itemId, boundaryScope) {
  if (itemType === relationships.SERVICE) {
    return getServiceDashboard(itemId, { boundaryScope });
  }
  return getApplicationDashboard(itemId, { boundaryScope });
}
