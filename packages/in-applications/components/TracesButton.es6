import { get } from 'lodash';
import React from 'react';

import getMetrics from 'in-subscription/application/getMetrics';
import { number } from 'in-services/formatters/number';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';

export default connect(
  ({ filter }) => ({
    result: getMetrics({
      filter,
      metrics: {
        traceCount: {
          metric: 'traces',
          aggregation: 'DISTINCT_COUNT'
        }
      }
    })
  }),
  function TracesButton({ result, size = 'compact', kind = 'secondary' }) {
    if (result.data == null) {
      return null;
    }

    const metricValue = get(result, ['data', 'traceCount', '0', '1'], null);
    if (metricValue == null) {
      return null;
    }

    return (
      <Button kind={kind} size={size} icon="app_trace" onClick={() => alert('Coming soon!')}>
        {number.compact(metricValue)} Traces
      </Button>
    );
  }
);
