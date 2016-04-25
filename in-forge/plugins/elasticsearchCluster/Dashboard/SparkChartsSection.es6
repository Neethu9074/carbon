import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import {timeframeShape} from 'in-stores/timeline';

import './SparkChartsSection.less';


const block = 'in-spark-chart-section';

export default React.createClass({

  displayName: 'ElasticsearchClusterSparkChartsSection',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshotId: React.PropTypes.string.isRequired,
    timeframe: timeframeShape.isRequired
  },

  render() {
    return (
      <div className={block}>
        {this.sparkChart('node_count')}
        {this.sparkChart('APPLY CORRECT INCIDES METRIC HERE')}
        {this.sparkChart('APPLY CORRECT ACTIVE SHARDS METRIC HERE', 250)}
        {this.sparkChart('document_count')}
        {this.sparkChart('APPLY CORRECT SIZE OF STORE METRIC HERE')}
      </div>
    );
  },

  sparkChart(metric, width = 100) {
    const snapshotId = this.props.snapshotId;
    const timeframe = this.props.timeframe;

    return (
      <HistoricMetricSparkChart width={width}
                                height={30}
                                timeframe={timeframe}
                                snapshotId={snapshotId}
                                className={block + '__chart'}
                                metric={metric} />
    );
  }
});
