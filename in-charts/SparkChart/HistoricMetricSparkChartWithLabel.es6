import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';
import * as timelineStore from 'in-stores/timeline';

import './HistoricMetricSparkChartWithLabel.less';

const rpt = React.PropTypes;
const block = 'in-labeled-spark-chart';

export default React.createClass({
  displayName: 'HistoricMetricSparkChartWithLabel',

  mixins: [PureRenderMixin],

  propTypes: {
    width: rpt.number.isRequired,
    height: rpt.number.isRequired,
    timeframe: timelineStore.timeframeShape.isRequired,

    snapshotId: rpt.string.isRequired,
    metric: rpt.string.isRequired,
    rollup: rpt.number,
    aggregation: rpt.string,
    formatter: rpt.func
  },

  render() {
    return (
      <div className={block}>
        <MetricValue snapshotId={this.props.snapshotId}
                     metric={this.props.metric}
                     formatter={this.props.formatter}
                     className={block + '__value'}/>
        <HistoricMetricSparkChart {...this.props}
                                  className={block + '__chart'}/>
      </div>
    );
  }
});
