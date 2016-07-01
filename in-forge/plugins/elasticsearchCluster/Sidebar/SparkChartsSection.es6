import React from 'react';

import {withSiPrefixTwoDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';

import './SparkChartsSection.less';


const block = 'in-spark-chart-section';

export default function ElasticsearchClusterSparkChartsSection({snapshotId, timeframe}) {
  return (
    <div className={block}>
      {sparkChart(snapshotId, timeframe, 'node_count', 'Nodes', withSiPrefixTwoDecimalPlaces)}
      {sparkChart(snapshotId, timeframe, 'indices_count', 'Indices', withSiPrefixTwoDecimalPlaces)}
      {sparkChart(snapshotId, timeframe, 'active_shards_count', 'Active Shards', withSiPrefixTwoDecimalPlaces, 280)}
      {sparkChart(snapshotId, timeframe, 'document_count', 'Documents', withSiPrefixTwoDecimalPlaces)}
      {sparkChart(snapshotId, timeframe, 'store_size', 'Size of store', bytesTwoDecimalPlaces)}
    </div>
  );
}

function sparkChart(snapshotId, timeframe, metric, title, formatter, width = 130) {
  return (
    <div className={block + '__chart'}>
      <HistoricMetricSparkChart width={width}
                                height={30}
                                timeframe={timeframe}
                                snapshotId={snapshotId}
                                metric={metric}
                                tooltipFormatter={formatter}/>
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
