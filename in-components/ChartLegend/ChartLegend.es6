import React from 'react';

import {filterStoreShape} from 'in-components/ChartWithLegend/dataseriesFilterStore';
import classnames from 'in-services/util/classnames';
import MetricValue from 'in-components/MetricValue';
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
      activeFilters: props.filterStore.activeFilters$
    };
  }, React.createClass({
  displayName: 'ChartLegend',

  propTypes: {
    snapshotId: rpt.string.isRequired,
    y1: axisConfigShape.isRequired,
    y2: axisConfigShape,
    filterStore: filterStoreShape.isRequired,
    activeFilters: rpt.object.isRequired
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
    return (
      <dl className={classname + ' ' + classname + '--' + modifier}>
        {axis.metrics.map((metric, i) =>
          <div className={classnames({
                 [block + '__metric']: true,
                 [block + '__metric--disabled']: this.props.activeFilters[metric]
               })}
               key={metric}
               onClick={() => this.props.filterStore.toggleFilter(metric)}>
            <dt className={block + '__metric-label'}
                style={{color: theme.chart.strokeColors[themeMetricOffset + i]}}>
              {axis.labels[i]}
            </dt>
            <dd className={block + '__metric-value'}>
              <MetricValue snapshotId={this.props.snapshotId}
                           metric={metric}
                           formatter={axis.formatter}
                           initialValue='?' />
            </dd>
          </div>
        )}
      </dl>
    );
  }
}));
