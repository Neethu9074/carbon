import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';
import {timeframeShape} from 'in-stores/timeline';
import {
  zeroDecimalPlaces,
  bytesZeroDecimalPlaces
} from 'in-services/formatters/number';

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
        {this.sparkChart('node_count', 'Nodes', zeroDecimalPlaces)}
        {this.sparkChart('indices_count', 'Indices', zeroDecimalPlaces)}
        {this.sparkChart('active_shards_count', 'Active Shards', zeroDecimalPlaces, 280)}
        {this.sparkChart('document_count', 'Documents', zeroDecimalPlaces)}
        {this.sparkChart('store_size', 'Size of store', bytesZeroDecimalPlaces)}
      </div>
    );
  },

  sparkChart(metric, title, formatter, width = 100) {
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
                       className={block + '__value'}
                       formatter={formatter}/>
        </div>
      </div>
    );
  }
});
