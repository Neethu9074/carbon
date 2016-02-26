import irpt from 'react-immutable-proptypes';
import React from 'react';

import MetricValue from 'in-components/MetricValue';
import {theme} from 'in-services/theme';

import './ChartLegend.less';

const rpt = React.PropTypes;
const block = 'in-chart-legend';

const axisConfigShape = rpt.shape({
  metrics: rpt.arrayOf(rpt.string).isRequired,
  labels: rpt.arrayOf(rpt.string).isRequired,
  formatter: rpt.func
});

const ChartLegend = React.createClass({
  propTypes: {
    snapshot: irpt.map.isRequired,
    y1: axisConfigShape.isRequired,
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
    return (
      <dl className={classname + ' ' + classname + '--' + modifier}>
        {axis.metrics.map((metric, i) =>
          <div className={block + '__metric'}
               key={metric}>
            <dt className={block + '__metric-label'}
                style={{color: theme.chart.strokeColors[themeMetricOffset + i]}}>
              {axis.labels[i]}
            </dt>
            <dt className={block + '__metric-value'}>
              <MetricValue snapshotId={this.props.snapshot.get('id')}
                           metric={metric}
                           formatter={axis.formatter}
                           initialValue='?' />
            </dt>
          </div>
        )}
      </dl>
    );
  }
});

export default ChartLegend;
