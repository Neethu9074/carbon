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
  const kpi = `${block}__kpi ${block}__kpi`;

  return (
    <div key={data.name} className={block} onClick={onClick}>
      <div className={nameElement}>
        {data.name}
        <span className={detailsElement}>Details</span>
      </div>

      <div className={metrics}>
        <div className={kpis}>
          <div>
            <span className={`${kpi}__load`}>
              {data.pageLoad ? data.pageLoad : '--'}
            </span>
            <span className={`${kpi}__time`}>
              {data.loadTime ? data.loadTime : '--'}
            </span>
            <span className={`${kpi}__errors`}>
              {data.errors ? data.errors : '--'}
            </span>
          </div>
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
            minPixelPerBlock: 5,
            maxDataPoints: 200,
            metricBaseMillis: 5000
          }}
          y2={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['duration.mean'],
            labels: ['Load time'],
            colors: ['#4b626b'],
            type: 'discreteLine',
            aggregation: 'mean',
            minPixelPerBlock: 5,
            maxDataPoints: 200
          }}
        />
      </div>
    </div>
  );
}
