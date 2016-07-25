import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';
import {timeframe$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './SparkChartsSection.less';


const block = 'in-spark-chart-section';

export default connectTo({
  timeframe: timeframe$
}, function SparkChartsSection({snapshot, timeframe, metrics}) {
  return (
    <div className={block}>
      {metrics.map(metric =>
        <SparkChart key={metric.metric}
                    snapshotId={snapshot.get('id')}
                    metric={metric.metric}
                    label={metric.label}
                    formatter={metric.formatter}
                    timeframe={timeframe} />
      )}
    </div>
  );
});

function SparkChart({snapshotId, timeframe, metric, label, formatter}) {
  return (
    <div className={block + '__chart'}>
      <HistoricMetricSparkChart width={115}
                                height={30}
                                timeframe={timeframe}
                                snapshotId={snapshotId}
                                metric={metric}
                                tooltipFormatter={formatter} />
      <div className={block + '__description'}>
        <span className={block + '__title'}>
          {label}
        </span>
        <MetricValue snapshotId={snapshotId}
                     metric={metric}
                     className={block + '__value'}
                     formatter={formatter}/>
      </div>
    </div>
  );
}
