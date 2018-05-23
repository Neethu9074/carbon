import invariant from 'invariant';
import React from 'react';

import TabHeader from 'in-new-components/LocationAwareTabView/tabs/TabHeader';
import getMetrics from 'in-subscription/application/getMetrics';
import { number } from 'in-services/formatters/number';
import connect from 'in-hoc/connectTo';

export function getTabHeaderWithAppDataMetricCount({ icon = null, getMetricsParams, formatter = number.compact }) {
  if (__DEV__) {
    invariant(
      getMetricsParams != null,
      'getTabHeaderWithAppDataMetricCount should only be used to retrieve custom counts.'
    );
  }

  return connect(props => {
    const params = getMetricsParams(props);
    const metricName = Object.keys(params.metrics)[0];
    return {
      count: getMetrics(params)
        .map(result => {
          if (result.data == null) {
            // do not show progress or errors in the tab view. This would be too much flickering / noise
            // for rather unimportant pieces of information.
            return null;
          }

          const values = result.data[metricName];
          if (values == null || values.length === 0) {
            // no values? Should never be the case when we stick to the data access contract.
            return null;
          }

          return values[values.length - 1][1];
        })
        .filter(v => v != null)
    };
  })(props => <TabHeader {...props} icon={icon} count={props.count != null ? formatter(props.count) : null} />);
}
