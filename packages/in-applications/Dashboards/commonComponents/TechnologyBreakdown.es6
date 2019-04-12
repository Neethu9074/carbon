import React from 'react';

import getTechnologyBreakdown from 'in-subscription/application/getTechnologyBreakdown';
import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { endpointNameTranslations } from 'in-applications/endpointTypes';
import { millis, meanLatencyFixed } from 'in-services/formatters/number';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { compareIgnoreCase } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

export default connectTo(
  ({ applicationId, serviceId, endpointId, timeConfig }) => ({
    result: getTechnologyBreakdown({
      filter: {
        application: applicationId,
        service: serviceId,
        endpoint: endpointId,
        timeConfig: extendWindowSizeOnLiveMode(timeConfig)
      },
      breakdownType: 'PROCESSING_TIME',
      granularity: getChartGranularity(timeConfig)
    })
  }),
  function TechnologyBreakdownPresenter({ timeConfig, result }) {
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
      const colors = endpointTypes.map(
        (type, i) => (type === 'SELF' ? theme.lib.colors.chart.self25 : theme.lib.colors.chart.strokeColors25[i])
      );

      config = {
        cardTitle: config.cardTitle,
        timeConfig: getResolvedTimeConfig(timeConfig, result),
        granularity: getChartGranularity(timeConfig),
        y1: {
          renderer: Renderer.stackedArea,
          labels,
          metrics,
          colors,
          formatter: millis.forcedFixedCompact,
          tooltipFormatter: meanLatencyFixed.compact,
          min: 0
        }
      };
    }

    return <ResultAwareChart result={result} config={config} />;
  }
);
