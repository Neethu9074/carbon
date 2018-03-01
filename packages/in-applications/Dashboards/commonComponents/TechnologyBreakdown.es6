import React from 'react';

import getPerEndpointTypeSummary from 'in-subscription/application/getPerEndpointTypeSummary';
import { getResolvedTimeframe, getChartGranularity } from 'in-applications/metrics';
import ChartWrapperPresenter from 'in-components/Chart/ChartWrapperPresenter';
import getMetrics from 'in-subscription/application/getMetrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { compareIgnoreCase } from 'in-services/util/string';
import { millis } from 'in-services/formatters/number';
import connect from 'in-hoc/connectTo';

export default connect(({ applicationId, serviceId, endpointId, timeframe, withoutSelf }) => ({
  outgoingResult: getPerEndpointTypeSummary({
    direction: 'OUTGOING',
    filter: {
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      timeframe
    },
    metrics: {
      latency: {
        metric: 'latency',
        granularity: getChartGranularity(timeframe),
        aggregation: 'MEAN'
      }
    }
  }),
  selfResult: withoutSelf
    ? undefined
    : getMetrics({
        filter: {
          application: applicationId,
          service: serviceId,
          endpoint: endpointId,
          timeframe
        },
        metrics: {
          selfLatency: {
            metric: 'selfLatency',
            granularity: getChartGranularity(timeframe),
            aggregation: 'MEAN'
          }
        }
      })
}))(TechnologyBreakdownPresenter);

function TechnologyBreakdownPresenter({ outgoingResult, selfResult, timeframe, withoutSelf }) {
  // error or loading case
  if (outgoingResult.data == null) {
    return <ChartWrapperPresenter legendAlignment="bottom" result={outgoingResult} />;
  } else if (!withoutSelf && selfResult.data == null) {
    return <ChartWrapperPresenter legendAlignment="bottom" result={selfResult} />;
  }

  const dataSeries = outgoingResult.data.slice().sort((a, b) => compareIgnoreCase(a.type, b.type));

  const labels = dataSeries.map(s => s.type);
  const metrics = dataSeries.map(s => s.metrics.latency);

  if (!withoutSelf) {
    labels.unshift('SELF');
    metrics.unshift(selfResult.data.selfLatency);
  }

  const config = {
    timeframe: getResolvedTimeframe(timeframe, outgoingResult),
    minRollup: getChartGranularity(timeframe),
    y1: {
      renderer: Renderer.stackedArea,
      labels,
      metrics,
      formatter: millis
    }
  };

  return <ChartWrapperPresenter legendAlignment="bottom" result={outgoingResult} config={config} />;
}
