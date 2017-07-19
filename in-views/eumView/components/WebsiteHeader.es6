import React from 'react';
import SortIndicator from 'in-views/eumView/components/SortIndicator';

import './WebsiteHeader.less';

export default function WebsiteHeader({ columnDefinitions, sortColumnIndex, sortDirection, onChangeSort }) {
  const block = 'in-website-table-header';
  const idHeader = `${block}__id`;
  const kpiHeader = `${block}__kpis`;
  const kpiElement = `${kpiHeader}__kpi`;

  const name = columnDefinitions.filter(def => def.index === 0).map(def => {
    return (
      <div key={def.title} className={idHeader}>
        <SortIndicator
          title={def.title}
          index={def.index}
          sortIndex={sortColumnIndex}
          sortDirection={sortDirection}
          onChangeSort={onChangeSort}
        />
      </div>
    );
  });

  const kpis = columnDefinitions.filter(def => def.index > 0).map(def => {
    return (
      <div key={def.title} className={kpiElement}>
        <SortIndicator
          title={def.title}
          index={def.index}
          sortIndex={sortColumnIndex}
          sortDirection={sortDirection}
          onChangeSort={onChangeSort}
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
