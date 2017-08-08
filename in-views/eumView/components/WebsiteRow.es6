import React from 'react';

import WebsiteIssueButton from 'in-views/eumView/components/WebsiteIssueButton';
import { twoDecimalPlaces, number } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getDashboardLink } from 'in-stores/navigation';
import Chart from 'in-components/EumChart';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './WebsiteRow.less';

const block = 'in-website-table-row';

export default function WebsiteRow({ snapshot, data }) {
  const snapshotId = snapshot.get('id');

  const metrics = `${block}__metrics`;
  const nameElement = `${block}__name`;
  const kpis = `${block}__kpis`;

  return (
    <div key={data.name} className={block}>
      <div className={nameElement}>
        {data.name}
        <ViewDetailsButton snapshotId={snapshotId} />
      </div>

      <div className={metrics}>
        <div className={kpis}>
          <WebsiteKpiSection snapshotId={snapshotId} />
          <WebsiteIssueButton snapshotId={snapshotId} />
        </div>

        {data.pageLoad == null ? <LoadingIndicator type="dark" inline className={`${block}__loading`} /> : null}

        {data.pageLoad < 1 ? <NoDataMessage /> : null}

        {data.pageLoad >= 1
          ? <Chart
              snapshotId={snapshotId}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['count'],
                labels: ['views'],
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
                type: 'discreteLine',
                aggregation: 'mean',
                minPixelPerBlock: 5,
                maxDataPoints: 100
              }}
            />
          : null}
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

function NoDataMessage() {
  return (
    <h2 className={`${block}__no-data-message`}>
      No views in the given time window
    </h2>
  );
}
