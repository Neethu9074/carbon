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
      <SortIndicator
        key={def.index}
        className={idHeader}
        title={def.title}
        index={def.index}
        sortIndex={sortColumnIndex}
        sortDirection={sortDirection}
        onChangeSort={onChangeSort}
      />
    );
  });

  const kpis = columnDefinitions.filter(def => def.index > 0).map(def => {
    return (
      <SortIndicator
        key={def.index}
        className={kpiElement}
        title={def.title}
        index={def.index}
        sortIndex={sortColumnIndex}
        sortDirection={sortDirection}
        onChangeSort={onChangeSort}
      />
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
