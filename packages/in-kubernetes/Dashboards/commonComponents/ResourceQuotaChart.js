import { combineLatest } from 'reactive-observables';
import React from 'react';

import createLatestMetricsObservable from 'in-subscription/latestMetrics';
import BasicWrapper from 'in-new-components/Errors/BasicWrapper';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './ResourceQuotaChart.mless';

export default connectTo(
  ({ snapshotId, timeConfig, metrics }) => ({
    containsResourceQuotaMetrics: combineLatest(
      metrics.map(metric =>
        createLatestMetricsObservable({
          snapshotId,
          metric,
          rollup: 5000,
          timeConfig
        }).map(metric => metric[1])
      )
    ).map(metrics => {
      if (!metrics || metrics.length === 0) {
        return true;
      }
      return metrics.filter(v => v !== -1).length !== 0;
    })
  }),
  function ResourceQuotaChart({ containsResourceQuotaMetrics, renderChart }) {
    if (containsResourceQuotaMetrics === false) {
      return (
        <BasicWrapper
          height={194}
          text="No resource quotas"
          renderIcon={size => <SvgIcon className={locals.icon} type="lib_infinity" size={size} />}
        />
      );
    }

    return renderChart();
  }
);
