import { combineLatest } from 'reactive-observables';
import React from 'react';

import { msTwoDecimalPlaces } from 'in-services/formatters/number';
import { getMetric } from 'in-stores/metric/metric';
import createScale from 'in-charts/scale';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-services/theme';

import './PageLoadBreakdownChart.less';

const block = 'in-website-page-load-breakdown-chart';

export default connectTo(
  props => {
    return {
      metrics: combineLatest(
        ['unl', 'red', 'apc', 'dns', 'tcp', 'ssl', 'req', 'rsp', 'dom', 'chi'].map(metric =>
          getMetric({
            snapshotId: props.snapshotId,
            metric,
            timeWindowAggregation: 'mean',
            forceTimeWindowAggregation: true
          })
        )
      )
    };
  },
  function PageLoadBreakdownChart({ metrics }) {
    if (!metrics) {
      // TODO: at least show the chart but without the bars
      return null;
    }

    const scale = createScale();
    scale.setRangeFrom(0);
    scale.setRangeTo(100);
    scale.setDomainFrom(0);

    const containsNullValues = metrics.indexOf(null) >= 0;
    if (containsNullValues) {
      // TODO: at least show the chart but without the bars
      return null;
    }

    const labels = ['Unload', 'Redirect', 'AppCache', 'DNS', 'TCP', 'SSL', 'Request', 'Response', 'DOM', 'Children'];
    const colors = theme.chart.strokeColors;
    const totalTime = metrics.reduce((a, b) => a + b, 0);
    scale.setDomainTo(totalTime);

    let prevWidth = 0;

    return (
      <div className={block}>
        <div className={`${block}__chart-background`} />
        {metrics.map((metricValue, i) => {
          const label = labels[i];
          const left = prevWidth;
          const width = scale.getRange(metricValue);
          prevWidth += width;

          return (
            <div key={label} className={`${block}__row`}>
              <span className={`${block}__label`}>
                {label}
              </span>
              <span className={`${block}__value`}>
                {msTwoDecimalPlaces(metricValue)}
              </span>
              <div className={`${block}__lane-wrapper`}>
                <div
                  className={`${block}__lane`}
                  style={{
                    background: colors[i],
                    left: `${left}%`,
                    width: `${width}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);
