import irpt from 'react-immutable-proptypes';
import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import * as timelineStore from 'in-stores/timeline';
import MetricValue from 'in-components/MetricValue';
import connectTo from 'in-hoc/connectTo';
import {getKpis} from 'in-sdk/kpi';

import './SparkChartsSection.less';


const block = 'in-spark-chart-section';

export default connectTo({
    timeframe: timelineStore.timeframe
  }, SparkChartsSection
);

function SparkChartsSection({snapshot, timeframe}) {
  const kpis = getKpis(snapshot);
  return (
    <div className={block}>
      {kpis.map(kpi =>
        <SparkChart key={kpi.metric}
                    snapshotId={snapshot.get('id')}
                    metric={kpi.metric}
                    title={kpi.label}
                    formatter={kpi.formatter}
                    timeframe={timeframe} />
      )}
    </div>
  );
}

function SparkChart({snapshotId, timeframe, metric, title, formatter}) {
  return (
    <div className={block + '__chart'}>
      <HistoricMetricSparkChart width={123}
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

SparkChartsSection.propTypes = {
  timeframe: timelineStore.timeframeShape,
  snapshot: irpt.map.isRequired
};
