import React from 'react';

import getPerEndpointTypeSummary from 'in-subscription/application/getPerEndpointTypeSummary';
import { getResolvedTimeframe, getChartGranularity } from 'in-applications/metrics';
import ChartWrapperPresenter from 'in-components/Chart/ChartWrapperPresenter';
import getMetrics from 'in-subscription/application/getMetrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { compareIgnoreCase } from 'in-services/util/string';
import { millis } from 'in-services/formatters/number';
import connect from 'in-hoc/connectTo';

export default connect(({ applicationId, serviceId, endpointId, timeframe }) => ({
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
  selfResult: getMetrics({
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

function TechnologyBreakdownPresenter({ outgoingResult, selfResult, timeframe }) {
  // error or loading case
  if (outgoingResult.data == null) {
    return <ChartWrapperPresenter result={outgoingResult} />;
  } else if (selfResult.data == null) {
    return <ChartWrapperPresenter result={selfResult} />;
  }

  const dataSeries = outgoingResult.data.slice().sort((a, b) => compareIgnoreCase(a.type, b.type));

  const config = {
    timeframe: getResolvedTimeframe(timeframe, outgoingResult),
    minRollup: getChartGranularity(timeframe),
    y1: {
      renderer: Renderer.stackedArea,
      labels: ['SELF'].concat(dataSeries.map(s => s.type)),
      metrics: [selfResult.data.selfLatency].concat(dataSeries.map(s => s.metrics.latency)),
      formatter: millis
    }
  };

  return <ChartWrapperPresenter result={outgoingResult} config={config} />;
}
