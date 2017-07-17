import React from 'react';

import './WebsiteHeader.less';

export default function WebsiteHeader({ data }) {
  const block = 'in-website-table-header';
  const idHeader = `${block}__id`;
  const kpiHeader = `${block}__kpis`;
  const kpiElement = `${kpiHeader}__kpi`;

  const name = (
    <div id={data.websiteName.name} className={idHeader}>
      {data.websiteName.name}
    </div>
  );

  const kpis = data.websiteKpis.map(kpi => {
    return <div key={kpi.name} className={kpiElement}>{kpi.name}</div>;
  });

  return (
    <div className={block}>
      {name}
      <div className={kpiHeader}>
        {kpis}
      </div>
    </div>
  );
}
