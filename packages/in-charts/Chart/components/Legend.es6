import rpt from 'prop-types';
import React from 'react';

import { hexToRGB } from 'in-services/formatters/color';
import { alwaysNull } from 'in-services/fixedStreams';
import classnames from 'in-services/util/classnames';
import MetricValue from 'in-components/MetricValue';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

import './Legend.less';

const block = 'in-chart-legend';

const axisConfigShape = rpt.shape({
  metrics: rpt.arrayOf(rpt.string).isRequired,
  labels: rpt.arrayOf(rpt.string).isRequired,
  formatter: rpt.arrayOf(rpt.func).isRequired
});

export default connectTo(
  props => {
    return {
      activeFilters: props.filterStore.activeFilters$,
      time: props.timeframe$ ? props.timeframe$.map(timeframe => timeframe.to) : alwaysNull
    };
  },
  class extends React.Component {
    static displayName = 'Legend';

    static propTypes = {
      snapshotIds: rpt.arrayOf(rpt.string),
      y1: axisConfigShape.isRequired,
      snapshotId: rpt.string,
      y2: axisConfigShape
    };

    render() {
      return (
        <div className={block}>
          {this.renderList(this.props.y1, 'y1', 0)}
          {this.props.y2 ? this.renderList(this.props.y2, 'y2', this.props.y1.metrics.length) : null}
        </div>
      );
    }

    renderList = (axis, modifier, themeMetricOffset) => {
      const classname = block + '__metrics';
      const props = this.props;
      const colors = theme.chart.strokeColors;

      return (
        <dl className={classname + ' ' + classname + '--' + modifier}>
          {axis.metrics.map((metric, i) => {
            const snapshotId = this.props.snapshotId || this.props.snapshotIds[i + themeMetricOffset];
            const color = axis.colors != null ? axis.colors[i] : colors[(themeMetricOffset + i) % colors.length];
            const label = axis.labels[i];
            const uid = axis.uids[i];

            return (
              <div
                className={classnames({
                  [block + '__metric']: true,
                  [block + '__metric--disabled']: props.activeFilters[uid]
                })}
                key={i}
                onClick={() => props.filterStore.toggleFilter(uid)}
                style={{
                  background: toBackground(color)
                }}
              >
                <dt
                  className={block + '__metric-label'}
                  style={{
                    color
                  }}
                >
                  {label}
                </dt>
                <dd className={block + '__metric-value'}>
                  <MetricValue
                    snapshotId={snapshotId}
                    metric={metric}
                    time={props.time}
                    formatter={axis.formatter[i]}
                    initialValue="––"
                    timeWindowAggregation={axis.aggregation ? axis.aggregation[i] : null}
                  />
                </dd>
              </div>
            );
          })}
        </dl>
      );
    };
  }
);

function toBackground(hexColor) {
  const color = hexToRGB(hexColor);
  return `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`;
}
