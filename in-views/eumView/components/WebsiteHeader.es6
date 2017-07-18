import React from 'react';

import SortIndicator from 'in-components/Table/components/SortIndicator';

import './WebsiteHeader.less';

export default function WebsiteHeader({ data, sortColumnIndex, sortDirection, onChangeSort }) {
  const block = 'in-website-table-header';
  const idHeader = `${block}__id`;
  const kpiHeader = `${block}__kpis`;
  const kpiElement = `${kpiHeader}__kpi`;

  const name = (
    <div id={data.websiteName.name} className={idHeader}>
      <SortIndicator
        title={data.websiteName.name}
        index={data.websiteName.index}
        sortIndex={sortColumnIndex}
        sortDirection={sortDirection}
        onChangeSort={onChangeSort}
        columnDefinition={{ disableSorting: false }}
      />
    </div>
  );

  const kpis = data.websiteKpis.map(kpi => {
    return (
      <div key={kpi.name} className={kpiElement}>
        <SortIndicator
          title={kpi.name}
          index={kpi.index}
          sortIndex={sortColumnIndex}
          sortDirection={sortDirection}
          onChangeSort={onChangeSort}
          columnDefinition={{ disableSorting: false }}
        />
      </div>
    );
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
