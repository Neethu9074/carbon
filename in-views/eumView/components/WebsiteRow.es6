import React from 'react';

import WebsiteIssueButton from 'in-views/eumView/components/WebsiteIssueButton';
import { twoDecimalPlaces, number } from 'in-services/formatters/number';
import { getDashboardLink } from 'in-stores/navigation';
import Chart from 'in-components/EumChart';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './WebsiteRow.less';

const block = 'in-website-table-row';

export default function WebsiteRow({ snapshot, data }) {
  const metrics = `${block}__metrics`;
  const nameElement = `${block}__name`;
  const kpis = `${block}__kpis`;

  return (
    <div key={data.name} className={block}>
      <div className={nameElement}>
        {data.name}
        <ViewDetailsButton snapshotId={snapshot.get('id')} />
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
            formatter: number.compact,
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

const ViewDetailsButton = connectTo(
  props => {
    return { href: getDashboardLink(props.snapshotId) };
  },
  function ViewDetailsButton({ href }) {
    return (
      <Button size="sm" href={href} className={`${block}__details-button`}>
        View Details
      </Button>
    );
  }
);

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
