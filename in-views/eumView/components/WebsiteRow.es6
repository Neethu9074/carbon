import React from 'react';

import { twoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import WebsiteIssueButton from 'in-views/eumView/components/WebsiteIssueButton';
import Chart from 'in-components/EumChart';

import './WebsiteRow.less';

const block = 'in-website-table-row';

export default function WebsiteRow({ snapshot, data, onClick }) {
  const metrics = `${block}__metrics`;
  const nameElement = `${block}__name`;
  const detailsElement = `${block}__details`;
  const kpis = `${block}__kpis`;

  return (
    <div key={data.name} className={block}>
      <div className={nameElement}>
        {data.name}
        <div className={detailsElement} onClick={onClick}>
          View Details
        </div>
      </div>

      <div className={metrics}>
        <div className={kpis}>
          <Kpi metricName="Views" classNameAppendix="__load" metricData={data.pageLoad} />
          <Kpi metricName="Load Time" classNameAppendix="__time" metricData={data.loadTime} />
          <div className={`${block}__kpi-block`}>
            Health
            <div className={`${block}__health`}>
              {data.health}
            </div>
          </div>
          <WebsiteIssueButton snapshotId={snapshot.get('id')} />
        </div>
        <Chart
          snapshotId={snapshot.get('id')}
          y1={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['count'],
            labels: ['views'],
            colors: ['#c8cdd8'],
            tooltipColors: ['#ffffff'],
            type: 'bar',
            aggregation: 'sum',
            minPixelPerBlock: 5,
            maxDataPoints: 100
          }}
          y2={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['duration.mean'],
            labels: ['load time'],
            colors: ['#6B8088'],
            tooltipColors: ['#ffffff'],
            type: 'discreteLine',
            minPixelPerBlock: 5,
            maxDataPoints: 100
          }}
        />
      </div>
    </div>
  );
}

function Kpi({ metricName, metricData, classNameAppendix }) {
  const kpi = `${block}__kpi ${block}__kpi`;
  return (
    <div className={`${block}__kpi-block`}>
      <span className={`${block}__metric-name`}>
        {metricName}
      </span>
      <span className={`${kpi}${classNameAppendix}`}>
        {metricData ? metricData : '--'}
      </span>
    </div>
  );
}
