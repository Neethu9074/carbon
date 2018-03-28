import React from 'react';

import getTechnologyBreakdown from 'in-subscription/application/getTechnologyBreakdown';
import { getChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import ChartWrapperPresenter from 'in-components/Chart/ChartWrapperPresenter';
import { endpointNameTranslations } from 'in-applications/endpointTypes';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { compareIgnoreCase } from 'in-services/util/string';
import { millis } from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

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
      cardTitle: 'Processing Time'
    };
    if (result.data) {
      const endpointTypes = Object.keys(result.data).sort((a, b) => {
        // move SELF time to the bottom of the chart
        if (a === 'SELF') {
          return -1;
        } else if (b === 'SELF') {
          return 1;
        }
        return compareIgnoreCase(a, b);
      });
      const labels = endpointTypes.map(type => endpointNameTranslations[type]);
      const metrics = endpointTypes.map(type => result.data[type]);
      const colors = endpointTypes.map((type, i) => (type === 'SELF' ? '#e9edef' : theme.app20Chart.strokeColors25[i]));

      config = {
        cardTitle: config.cardTitle,
        timeframe: getResolvedTimeframe(timeframe, result),
        granularity: getChartGranularity(timeframe),
        y1: {
          renderer: Renderer.stackedArea,
          labels,
          metrics,
          colors,
          formatter: millis,
          min: 0
        }
      };
    }

    return <ChartWrapperPresenter result={result} config={config} />;
  }
);
