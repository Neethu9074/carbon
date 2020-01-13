import { get } from 'lodash';
import React from 'react';

import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId }) => {
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
  },
  function CallsErrors({
    applicationLabel,
    serviceLabel,
    endpointLabel,
    timeConfig,
    endpointId,
    applicationId,
    serviceId,
    isSynthetic,
    filters = [],
    groupByTag,
    metrics,
    showGraph,
    includeSyntheticCalls,
    boundaryScope,
    cardTitle
  }) {
    const granularity = getChartGranularity(timeConfig);

    return (
      <AppdataChartWrapper
        cardTitle={cardTitle}
        timeConfig={timeConfig}
        y1={{
          renderer: Renderer.countErrorBar,
          labels: ['Calls', 'Errors'],
          metricIds: ['calls', 'errors']
        }}
        metricsConfiguration={{
          filter: {
            timeConfig,
            endpoint: endpointId,
            application: applicationId,
            service: serviceId,
            applicationBoundaryScope: boundaryScope,
            includeSyntheticCalls
          },
          metrics: {
            calls: {
              metric: 'calls',
              granularity,
              aggregation: 'SUM'
            },
            errors: {
              metric: 'errors',
              granularity,
              aggregation: 'MEAN'
            }
          }
        }}
        additionalContextMenuButtons={[
          {
            icon: 'lib_analyze',
            label: 'View in Analytics',
            getHref$: highlightedTime =>
              getLinkToAnalyze({
                applicationName: applicationLabel,
                serviceName: serviceLabel,
                endpointName: endpointLabel,
                boundaryScope,
                dataSource: 'calls',
                filters: isSynthetic
                  ? [
                      { name: 'call.is_synthetic', value: 'true' },
                      { name: 'include_synthetic', value: 'true' },
                      ...filters
                    ]
                  : filters,
                groupByTag: groupByTag ? groupByTag : {},
                timeConfig: highlightedTime,
                metrics: metrics ? metrics : {},
                showGraph: showGraph ? true : {}
              })
          }
        ]}
      />
    );
  }
);

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
