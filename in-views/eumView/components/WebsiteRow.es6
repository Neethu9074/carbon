import React from 'react';

import WebsiteIssueButton from 'in-views/eumView/components/WebsiteIssueButton';
import { twoDecimalPlaces } from 'in-services/formatters/number';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import Chart from 'in-components/EumChart';
import connectTo from 'in-hoc/connectTo';

import './WebsiteRow.less';

const block = 'in-website-table-row';

export default connectTo(
  props => {
    return {
      healthInfo: getHealthInfoAtFocusedMoment(props.snapshot.get('id'))
    };
  },
  function WebsiteRow({ snapshot, data, healthInfo, onClick }) {
    const metrics = `${block}__metrics`;
    const nameElement = `${block}__name`;
    const detailsElement = `${nameElement}__details`;
    const kpis = `${block}__kpis`;
    const numberOfOpenIssues = healthInfo.get('numberOfOpenEvents');
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
            {numberOfOpenIssues > 0 ? <WebsiteIssueButton openIssues={numberOfOpenIssues} /> : null}
          </div>
          <Chart
            snapshotId={snapshot.get('id')}
            dynamicRollupAggregation="sum"
            y1={{
              min: 0,
              formatter: twoDecimalPlaces,
              metrics: ['count', 'xhrErrors'],
              labels: ['Calls/s', 'Errors'],
              type: 'bar',
              colors: ['#eaeff2', '#f6cfc6']
            }}
            y2={{
              min: 0,
              formatter: twoDecimalPlaces,
              metrics: ['xhrCalls'],
              labels: ['Calls'],
              type: 'discreteLine',
              colors: ['#4b626b']
            }}
          />
        </div>
      </div>
    );
  }
);
