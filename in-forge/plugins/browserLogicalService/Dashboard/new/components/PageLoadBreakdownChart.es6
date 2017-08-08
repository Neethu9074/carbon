import { combineLatest } from 'reactive-observables';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import { millis } from 'in-services/formatters/number';
import { getMetric } from 'in-stores/metric/metric';
import createScale from 'in-charts/scale';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-services/theme';

import './PageLoadBreakdownChart.less';

const block = 'in-website-page-load-breakdown-chart';

const metricNames = ['unl', 'red', 'apc', 'dns', 'tcp', 'ssl', 'req', 'rsp', 'dom', 'chi'];
const labels = ['Unload', 'Redirect', 'AppCache', 'DNS', 'TCP', 'SSL', 'Request', 'Response', 'DOM', 'Children'];

export default connectTo(
  props => {
    return {
      metrics: combineLatest(
        metricNames.map(metric =>
          getMetric({
            snapshotId: props.snapshotId,
            metric,
            timeWindowAggregation: 'mean',
            forceTimeWindowAggregation: true
          })
        )
      ).throttle(1000)
    };
  },
  function PageLoadBreakdownChart({ metrics, className }) {
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

    const colors = theme.chart.strokeColors;
    const totalTime = metrics.reduce((a, b) => a + b, 0);
    scale.setDomainTo(totalTime);

    let prevWidth = 0;

    return (
      <div className={joinClassNames(block, className)}>
        <div className={`${block}__chart-background`} />
        {metrics.map((metricValue, i) => {
          const label = labels[i];
          const left = prevWidth;
          const width = scale.getRange(metricValue);
          prevWidth += width;

          return (
            <div key={label} className={`${block}__row`}>
              <div className={`${block}__hover-bg`} style={{ background: colors[i] }} />
              <div className={`${block}__content`}>
                <span className={`${block}__label`}>
                  {label}
                </span>
                <span className={`${block}__value`}>
                  {millis.fixedCompact(metricValue)}
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
            </div>
          );
        })}
      </div>
    );
  }
);
