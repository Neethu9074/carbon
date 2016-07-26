import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';
import {timeframe$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './SparkChart.less';


const block = 'in-spark-chart';

export default connectTo({
  timeframe: timeframe$
}, function SparkChart({snapshotId, timeframe, metric, label, formatter, className, design}) {
    return (
      <div className={block + className ? ' ' + className : ''}>
        <HistoricMetricSparkChart width={115}
                                  height={30}
                                  timeframe={timeframe}
                                  snapshotId={snapshotId}
                                  design={design ? design : 'light'}
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
);
