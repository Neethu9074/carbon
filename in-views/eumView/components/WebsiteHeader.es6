import React from 'react';

import SortIndicator from 'in-views/eumView/components/SortIndicator';
import Pagination from 'in-components/Pagination';

import './WebsiteHeader.less';

export default function WebsiteHeader({
  columnDefinitions,
  sortColumnIndex,
  sortDirection,
  onChangeSort,
  data,
  onPrevPage,
  onNextPage
}) {
  const block = 'in-website-table-header';
  const idHeader = `${block}__id`;
  const kpiHeader = `${block}__kpis`;
  const kpiElement = `${kpiHeader}__kpi`;

  const name = (
    <SortIndicator
      key={columnDefinitions[0].index}
      className={idHeader}
      title={columnDefinitions[0].title}
      index={columnDefinitions[0].index}
      sortIndex={sortColumnIndex}
      sortDirection={sortDirection}
      onChangeSort={onChangeSort}
    />
  );

  const kpis = columnDefinitions
    .slice(1)
    .map(def =>
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

  const showPagination = data.pageCount > 1 || data.page >= data.pageCount;

  return (
    <div className={block}>
      {name}
      <div className={kpiHeader}>
        {kpis}
      </div>
      {showPagination
        ? <Pagination
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            currentPage={data.page}
            pageCount={data.pageCount}
            ariaLabel="Pagination for previous table"
          />
        : null}
    </div>
  );
}
