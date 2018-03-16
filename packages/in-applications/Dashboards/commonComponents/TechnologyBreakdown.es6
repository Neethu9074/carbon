import React from 'react';

import getTechnologyBreakdown from 'in-subscription/application/getTechnologyBreakdown';
import { getChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import { endpointNameTranslations, getColor } from 'in-applications/endpointTypes';
import ChartWrapperPresenter from 'in-components/Chart/ChartWrapperPresenter';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { millis } from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, timeframe }) => ({
    result: getTechnologyBreakdown({
      filter: {
        application: applicationId,
        service: serviceId,
        endpoint: endpointId,
        timeframe
      },
      breakdownType: 'PROCESSING_TIME',
      granularity: getChartGranularity(timeframe)
    })
  }),
  function TechnologyBreakdownPresenter({ timeframe, result }) {
    let config = {
      cardTitle: 'Downstream Processing Time'
    };
    if (result.data) {
      const endpointTypes = Object.keys(result.data);
      const labels = endpointTypes.map(type => endpointNameTranslations[type]);
      const colors = endpointTypes.map(type => getColor(type));
      const metrics = Object.keys(result.data).map(type => result.data[type]);
      config = {
        cardTitle: config.cardTitle,
        timeframe: getResolvedTimeframe(timeframe, result),
        granularity: getChartGranularity(timeframe),
        y1: {
          renderer: Renderer.stackedArea,
          labels,
          colors,
          metrics,
          formatter: millis
        }
      };
    }

    return <ChartWrapperPresenter result={result} config={config} />;
  }
);
