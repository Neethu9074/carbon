import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';
import {timeframeShape} from 'in-stores/timeline';

import './HistoricMetricSparkChartWithLabel.less';


const rpt = React.PropTypes;
const block = 'in-spark-chart-with-label';

export default React.createClass({
  displayName: 'HistoricMetricSparkChartWithLabel',

  mixins: [PureRenderMixin],

  propTypes: {
    timeframe: timeframeShape.isRequired,
    height: rpt.number.isRequired,
    width: rpt.number.isRequired,

    snapshotId: rpt.string.isRequired,
    metric: rpt.string.isRequired,
    aggregation: rpt.string,
    formatter: rpt.func,
    design: rpt.string,
    rollup: rpt.number
  },

  render() {
    return (
      <div className={block}>
        <MetricValue snapshotId={this.props.snapshotId}
                     metric={this.props.metric}
                     formatter={this.props.formatter}
                     className={block + '__value'} />
        <HistoricMetricSparkChart {...this.props}
                                  design={this.props.design}
                                  className={block + '__chart'}
                                  tooltipFormatter={this.props.formatter} />
      </div>
    );
  }
});
