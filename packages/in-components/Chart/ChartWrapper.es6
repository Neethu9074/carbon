import React from 'react';

import getMetrics from 'in-subscription/application/getMetrics';
import { getResolvedTimeframe } from 'in-applications/metrics';
import Chart from 'in-components/Chart/ChartReactComponent';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getMetrics(props.metricsConfiguration)
  }),
  class ChartWrapper extends React.Component {
    static displayName = 'ChartWrapper';

    render() {
      const { result } = this.props;

      if (result == null) {
        return 'Result was null';
      }

      if (result.errors.length > 0) {
        return result.errors.join(',');
      }

      if (result.progress.loading) {
        return 'Loading...';
      }

      return <Chart timeframe={getResolvedTimeframe(this.props.timeframe, result)} {...this.props} />;
    }
  }
);
