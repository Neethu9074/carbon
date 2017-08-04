import React from 'react';

import EntityHealthBar from 'in-components/EntityHealthBar';
import { getMetric } from 'in-stores/metric/metric';
import connectTo from 'in-hoc/connectTo';

import './WebsiteKpiSection.less';

const block = 'in-website-kpi-section';

export default connectTo(
  props => {
    return {
      pageLoad: getMetric({
        snapshotId: props.snapshotId,
        metric: 'count',
        timeWindowAggregation: 'sum',
        forceTimeWindowAggregation: true
      }),
      loadTime: getMetric({
        snapshotId: props.snapshotId,
        metric: 'duration.mean',
        timeWindowAggregation: 'mean',
        forceTimeWindowAggregation: true
      })
    };
  },
  function WebsiteKpiSection({ pageLoad, loadTime, snapshotId }) {
    return (
      <div className={block}>
        <Kpi metricName="Views" classNameAppendix="__load" metricData={pageLoad} />
        <Kpi metricName="Load Time" classNameAppendix="__time" metricData={loadTime} />
        <div className={`${block}__kpi-block`}>
          Health
          <div className={`${block}__health`}>
            <EntityHealthBar snapshotId={snapshotId} />
          </div>
        </div>
      </div>
    );
  }
);

function Kpi({ metricName, metricData, classNameAppendix }) {
  const kpi = `${block}__kpi ${block}__kpi`;
  return (
    <div className={`${block}__kpi-block`}>
      <span className={`${block}__metric-name ${block}__metric-name${classNameAppendix}`}>
        {metricName}
      </span>
      <span className={`${kpi}${classNameAppendix}`}>
        {metricData !== undefined && metricData !== null ? metricData : '––'}
      </span>
    </div>
  );
}
