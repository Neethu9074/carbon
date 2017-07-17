import React from 'react';

import { getLabel } from 'in-sdk/snapshot';

import './WebsiteRow.less';

export default function WebsiteRow({ snapshot, onClick }) {
  const block = 'in-website-table-row';
  const nameElement = `${block}__name`;
  const kpiContainer = `${block}__kpis`;
  const kpiElement = `${kpiContainer}__kpi`;

  const snapshotId = snapshot.get('id');
  const websiteName = getLabel(snapshot);
  return (
    <div key={snapshotId} className={block} onClick={onClick}>
      <div className={nameElement}>
        {websiteName}
      </div>
      <div className={kpiContainer}>
        <div>
          <span className={kpiElement}>
            3.1K
          </span>
          <span className={kpiElement}>
            4.2s
          </span>
          <span className={kpiElement}>
            4%
          </span>
        </div>
        <div>
          CHART
        </div>
      </div>
    </div>
  );
}
