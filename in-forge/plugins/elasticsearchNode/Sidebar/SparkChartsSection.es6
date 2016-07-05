import React from 'react';

import {withSiPrefixTwoDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';

import './SparkChartsSection.less';


const block = 'in-spark-chart-section';

export default function ElasticsearchNodeSparkChartsSection({snapshotId, timeframe}) {
  return (
    <div className={block}>
      {sparkChart(snapshotId, timeframe, 'indices_count', 'Indices', withSiPrefixTwoDecimalPlaces)}
      {sparkChart(snapshotId, timeframe, 'shards.node_active_shards', 'Active Shards', withSiPrefixTwoDecimalPlaces)}
      {sparkChart(snapshotId, timeframe, 'indices.document_count', 'Documents', withSiPrefixTwoDecimalPlaces)}
      {sparkChart(snapshotId, timeframe, 'indices.store_size', 'Size of store', bytesTwoDecimalPlaces)}
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
                                tooltipFormatter={formatter} />
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
