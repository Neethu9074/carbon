import { find } from 'lodash';
import React from 'react';

import { defaultFormatter, formatters } from 'in-custom-dashboards/widgets/_shared/formatters';
import ResultAwareKpiCard from 'in-new-components/KpiCard/ResultAwareKpiCard';
import { demo } from 'in-custom-dashboards/widgets/BigNumber/demo';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

const metricKey = 'bigNumber';

export default connectTo((/*{ config }*/) => ({
  result: timeConfig$.flatMap(timeConfig =>
    getUnifiedMetrics({
      metrics: {
        [metricKey]: {
          ...demo.metriConfiguration,
          timeConfig,
          granularity: null,
          resultType: 'SINGLE_NUMBER'
        }
      }
    })
  )
}))(BigNumber);

function BigNumber({ result, /*config, */ title }) {
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
          const formatter = find(formatters, ({ id }) => id === demo.formatter) || defaultFormatter;
          value = formatter.formatter(value);
        }

        return <KpiCard title={title} value={value} />;
      }}
    />
  );
}
