import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';
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
        {this.sparkChart('node_count', 'Nodes')}
        {this.sparkChart('APPLY CORRECT INCIDES METRIC HERE', 'Indices')}
        {this.sparkChart('APPLY CORRECT ACTIVE SHARDS METRIC HERE', 'Active Shards', 280)}
        {this.sparkChart('document_count', 'Documents')}
        {this.sparkChart('APPLY CORRECT SIZE OF STORE METRIC HERE', 'Size of store')}
      </div>
    );
  },

  sparkChart(metric, title, width = 100) {
    const snapshotId = this.props.snapshotId;
    const timeframe = this.props.timeframe;

    return (
      <div className={block + '__chart'}>
        <HistoricMetricSparkChart width={width}
                                  height={30}
                                  timeframe={timeframe}
                                  snapshotId={snapshotId}
                                  metric={metric} />
        <div className={block + '__description'}>
          <span className={block + '__title'}>
            {title}
          </span>
          <MetricValue snapshotId={snapshotId}
                       metric={metric}
                       className={block + '__value'}/>
        </div>
      </div>
    );
  }
});
