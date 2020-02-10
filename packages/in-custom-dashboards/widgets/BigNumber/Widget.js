import React from 'react';

import { defaultFormatter, formatters } from 'in-custom-dashboards/widgets/_shared/formatters';
import ResultAwareKpiCard from 'in-new-components/KpiCard/ResultAwareKpiCard';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

const metricKey = 'bigNumber';

export default connectTo(({ config }) => ({
  result: timeConfig$.flatMap(timeConfig =>
    getUnifiedMetrics({
      [metricKey]: {
        ...config.metriConfiguration,
        timeConfig,
        granularity: null,
        type: 'singleValue'
      }
    })
  )
}))(BigNumber);

function BigNumber({ result, config, title }) {
  return (
    <ResultAwareKpiCard
      title={title}
      result={result}
      renderKpiCard={result => {
        let value = null;
        if (result.data[metricKey] && result.data[metricKey].length === 1) {
          value = result.data[metricKey][0][1];
        }

        if (value != null) {
          const formatter = formatters[config.metriConfiguration.formatter] || formatters[defaultFormatter];
          value = formatter(value);
        }

        return <KpiCard title={title} value={value} />;
      }}
    />
  );
}
