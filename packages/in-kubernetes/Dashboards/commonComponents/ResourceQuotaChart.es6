import { combineLatest } from 'reactive-observables';
import React from 'react';

import createHistoricMetricObservable from 'in-subscription/historicMetric';
import BasicWrapper from 'in-new-components/Errors/BasicWrapper';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './ResourceQuotaChart.mless';

export default connectTo(
  ({ snapshotId, timeConfig, metrics }) => ({
    containsResourceQuotaMetrics: combineLatest(
      metrics.map(metric =>
        createHistoricMetricObservable({
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
          renderIcon={size => <SvgIcon className={locals.icon} type="lib_infinity" height={size} />}
        />
      );
    }

    return renderChart();
  }
);
