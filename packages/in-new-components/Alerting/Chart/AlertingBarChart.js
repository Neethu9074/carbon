import PropTypes from 'prop-types';
import React from 'react';

import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import { chartColors } from 'in-new-components/Alerting/utils/chartUtil';
import { propTypeTimeConfig } from 'in-stores/time/config';

export default function AlertingBarChart({ chartConfigForBlueprint, canReload }) {
  return (
    <AlertingBarChartWrapper
      {...chartConfigForBlueprint?.config}
      y1={{
        colors: chartColors,
        ...chartConfigForBlueprint?.y1
      }}
      canReload={canReload}
      nonInteractive
    />
  );
}

AlertingBarChart.propTypes = {
  canReload: PropTypes.bool,
  chartConfigForBlueprint: PropTypes.shape({
    y1: PropTypes.shape({
      metricIds: PropTypes.arrayOf(PropTypes.string).isRequired,
      excludedLabelsFromTooltip: PropTypes.arrayOf(PropTypes.string).isRequired,
      nonToggleableSeries: PropTypes.object.isRequired,
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
      formatter: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
      renderer: PropTypes.object.isRequired,
      icons: PropTypes.shape({
        types: PropTypes.arrayOf(PropTypes.string).isRequired,
        colors: PropTypes.arrayOf(PropTypes.string).isRequired
      }),
      threshold: PropTypes.number,
      operator: PropTypes.string.isRequired,
      thresholdGranularity: PropTypes.number.isRequired,
      getMax: PropTypes.func.isRequired
    }).isRequired,
    config: PropTypes.shape({
      thresholdType: PropTypes.string.isRequired,
      mutateMetrics: PropTypes.shape({
        doMutate: PropTypes.bool,
        metricNames: PropTypes.arrayOf(PropTypes.string).isRequired,
        mutate: PropTypes.func.isRequired
      }).isRequired,
      timeConfig: propTypeTimeConfig.isRequired,
      granularity: PropTypes.number.isRequired,
      getMetric: PropTypes.func.isRequired,
      metricsConfiguration: PropTypes.object.isRequired,
      renderPreChartContent: PropTypes.func.isRequired
    }).isRequired
  }).isRequired
};
