import React from 'react';

import {filterStoreShape} from 'in-components/ChartWithLegend/dataseriesFilterStore';
import {hexToRGB} from 'in-services/formatters/color';
import classnames from 'in-services/util/classnames';
import MetricValue from 'in-components/MetricValue';
import {alwaysNull} from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import './ChartLegend.less';


const rpt = React.PropTypes;
const block = 'in-chart-legend';

const axisConfigShape = rpt.shape({
  metrics: rpt.arrayOf(rpt.string).isRequired,
  labels: rpt.arrayOf(rpt.string).isRequired,
  formatter: rpt.func
});

export default connectTo(props => {
  return {
    activeFilters: props.filterStore.activeFilters$,
    timeframeTo: props.timeframe$ ? props.timeframe$.map(timeframe => timeframe.to) : alwaysNull
  };
},
React.createClass({
  displayName: 'ChartLegend',

  propTypes: {
    filterStore: filterStoreShape.isRequired,
    activeFilters: rpt.object.isRequired,
    snapshotId: rpt.string,
    snapshotIds: rpt.arrayOf(rpt.string),
    y1: axisConfigShape.isRequired,
    timeframeTo: rpt.number,
    y2: axisConfigShape
  },

  render() {
    return (
      <div className={block}>
        {this.renderList(this.props.y1, 'y1', 0)}
        {this.props.y2 ?
          this.renderList(this.props.y2, 'y2', this.props.y1.metrics.length)
        : null}
      </div>
    );
  },

  renderList(axis, modifier, themeMetricOffset) {
    const classname = block + '__metrics';
    const props = this.props;

    return (
      <dl className={classname + ' ' + classname + '--' + modifier}>
        {axis.metrics.map((metric, i) => {
          const snapshotId = this.props.snapshotId || this.props.snapshotIds[i + themeMetricOffset];
          const color = theme.chart.strokeColors[themeMetricOffset + i];
          const label = axis.labels[i];

          return (
            <div className={classnames({
                 [block + '__metric']: true,
                 [block + '__metric--disabled']: props.activeFilters[label]
               })}
               key={i}
               onClick={() => props.filterStore.toggleFilter(label)}
               style={{
                 background: toBackground(color)
               }}>
            <dt className={block + '__metric-label'}
                style={{
                  color
                }}>
              {label}
            </dt>
            <dd className={block + '__metric-value'}>
              <MetricValue snapshotId={snapshotId}
                           metric={metric}
                           timeframeTo={props.timeframeTo}
                           formatter={axis.formatter}
                           initialValue='?' />
            </dd>
          </div>
        );
      })}
      </dl>
    );
  }
}));


function toBackground(hexColor) {
  const color = hexToRGB(hexColor);
  return `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`;
}
