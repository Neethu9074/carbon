import React from 'react';

import WebsiteIssueButton from 'in-views/eumView/components/WebsiteIssueButton';
import { twoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/EumChart';

import './WebsiteRow.less';

const block = 'in-website-table-row';

export default function WebsiteRow({ snapshot, data, onClick }) {
  const metrics = `${block}__metrics`;
  const nameElement = `${block}__name`;
  const detailsElement = `${nameElement}__details`;
  const kpis = `${block}__kpis`;

  return (
    <div key={data.name} className={block} onClick={onClick}>
      <div className={nameElement}>
        {data.name}
        <div className={detailsElement}>
          View Details
        </div>
      </div>

      <div className={metrics}>
        <div className={kpis}>
          <Kpi metricName="Views" metricData={data.pageLoad} />
          <Kpi metricName="Load Time" metricData={data.loadTime} />
          <Kpi metricName="Uncaught Errors" metricData={data.errors} />
          <WebsiteIssueButton snapshotId={snapshot.get('id')} />
        </div>
        <Chart
          snapshotId={snapshot.get('id')}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['count'],
            labels: ['Views'],
            colors: ['#eaeff2'],
            type: 'bar',
            aggregation: 'sum',
            minPixelPerBlock: 5,
            maxDataPoints: 100,
            metricBaseMillis: 5000
          }}
          y2={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['duration.mean'],
            labels: ['Load time'],
            colors: ['#6B8088'],
            type: 'discreteLine',
            minPixelPerBlock: 5,
            maxDataPoints: 100
          }}
        />
      </div>
    </div>
  );
}

function Kpi({ metricName, metricData }) {
  const kpi = `${block}__kpi ${block}__kpi`;
  return (
    <div className={`${block}__kpi-block`}>
      <span className={`${block}__metric-name`}>
        {metricName}
      </span>
      <span className={`${kpi}__load`}>
        {metricData ? metricData : '--'}
      </span>
    </div>
  );
}
