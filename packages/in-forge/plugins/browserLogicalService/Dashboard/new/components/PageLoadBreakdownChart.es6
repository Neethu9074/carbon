import { combineLatest } from 'reactive-observables';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import { millis } from 'in-services/formatters/number';
import { getMetric } from 'in-stores/metric/metric';
import createScale from 'in-charts/scale';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

import './PageLoadBreakdownChart.less';

const block = 'in-website-page-load-breakdown-chart';

const onlyRequestMetrics = ['dns', 'tcp', 'ssl', 'req', 'rsp', 'dom', 'chi'];
const allMetrics = ['unl', 'red', 'apc'].concat(onlyRequestMetrics);
const onlyRequestLabels = ['DNS', 'TCP', 'SSL', 'Request', 'Response', 'DOM', 'Children'];
const allLabels = ['Unload', 'Redirect', 'AppCache'].concat(onlyRequestLabels);

export default connectTo(
  props => {
    const metrics = props.onlyRequest ? onlyRequestMetrics : allMetrics;
    return {
      metrics: combineLatest(
        metrics.map(metric =>
          getMetric({
            snapshotId: props.snapshotId,
            metric: props.metricPrefix + metric,
            timeWindowAggregation: 'mean',
            forceTimeWindowAggregation: true
          })
        )
      ).throttle(1000)
    };
  },
  function PageLoadBreakdownChart({ metrics, className, onlyRequest }) {
    metrics = metrics || [];

    const labels = onlyRequest ? onlyRequestLabels : allLabels;

    const scale = createScale();
    scale.setRangeFrom(0);
    scale.setRangeTo(100);
    scale.setDomainFrom(0);

    const colors = theme.chart.strokeColors;
    const totalTime = metrics.reduce((a, b) => a + (b != null ? b : 0), 0);
    scale.setDomainTo(totalTime);

    let prevWidth = 0;

    return (
      <div className={joinClassNames(block, className)}>
        <div className={`${block}__chart-background`} />
        {labels.map((label, i) => {
          const metricValue = metrics[i] != null ? millis.fixedCompact(metrics[i]) : '––';
          const left = prevWidth;
          const width = metrics[i] != null ? scale.getRange(metrics[i]) : 0;
          prevWidth += width;

          return (
            <div key={i} className={`${block}__row`}>
              <div className={`${block}__hover-bg`} style={{ background: colors[i] }} />
              <div className={`${block}__content`}>
                <span className={`${block}__label`}>{label}</span>
                <span className={`${block}__value`}>{metricValue}</span>
                <div className={`${block}__lane-wrapper`}>
                  {metrics[i] != null ? (
                    <div
                      className={`${block}__lane`}
                      style={{
                        background: colors[i],
                        left: `${left}%`,
                        width: `${width}%`
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);
