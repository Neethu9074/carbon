import { find } from 'lodash';
import React from 'react';

import { defaultFormatter, formatters } from 'in-custom-dashboards/widgets/_shared/formatters';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import ResultAwareKpiCard from 'in-new-components/KpiCard/ResultAwareKpiCard';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

const metricKey = 'bigNumber';

export default connectTo(({ config }) => ({
  result: timeConfig$.flatMap(timeConfig =>
    getUnifiedMetrics({
      metrics: {
        [metricKey]: {
          ...config.metricConfiguration,
          timeConfig,
          timeShift: translateOffsetToTimeShiftConfig(config.metricConfiguration.timeShift, timeConfig),
          granularity: null,
          resultType: 'SINGLE_NUMBER'
        }
      }
    })
  )
}))(BigNumber);

function BigNumber({ result, config, title, actions }) {
  return (
    <ResultAwareKpiCard
      title={title}
      result={result}
      useMaxAvailableHeight
      renderKpiCard={result => {
        let value = null;
        const dataPoint = find(result.data, ({ id }) => id === metricKey);
        if (dataPoint && dataPoint.values.length === 1) {
          value = dataPoint.values[0][1];
        }

        if (value != null) {
          const formatter = find(formatters, ({ id }) => id === config.formatter) || defaultFormatter;
          value = formatter.formatter(value);
        }

        return <KpiCard title={title} value={value} useMaxAvailableHeight actions={actions} />;
      }}
    />
  );
}
