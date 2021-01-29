/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import { ActionColumn, ErrorRows, Table, Tbody, Thead } from 'in-components/tables/sharedComponents';
import { filterColumns } from 'in-components/tables/ServerTable/internalComponents/columnBehavior';
import EmptyContent from 'in-components/tables/ServerTable/internalComponents/EmptyContent';
import LoadingRows from 'in-components/tables/ServerTable/internalComponents/LoadingRows';
import Columns from 'in-components/tables/ServerTable/internalComponents/Columns';
import Row from 'in-components/tables/ServerTable/internalComponents/Row';
import { Tr } from 'in-components/tables/sharedComponents/Table';

export default function CursorPaginatedTable(props) {
  const {
    // values configurable via the table
    orderBy,
    orderDirection,

    progress,
    errors,
    canLoadMore,
    loadMore,
    loadMoreLabel,
    items,

    getRowProps,
    onRowClick,
    fixedLayout,
    numSkeletonRows = 3,
    size = 'regular',
    cardTitle,
    tableInCard = false,
    noDataMessage,
    allRowsAreSelected = false,
    setSelectedStateForRows,
    renderNoDataAvailable,
    filterBy,
    filterByHref,

    // events
    onChange,
    onRowMouseEnter = () => {},
    onRowMouseLeave = () => {}
  } = props;
  const isLoading = progress?.loading;
  const hasErrors = errors?.length > 0;
  const hasItems = items?.length > 0;

  const { availableColumns, visibleColumns, optionalColumns, onColumnChecked } = filterColumns(props);

  return (
    <Fragment>
      <Table fixedLayout={fixedLayout} tableInCard={tableInCard || cardTitle != null}>
        <Thead>
          <Columns
            setOrder={(orderBy, orderDirection) => onChange({ orderBy, orderDirection })}
            columnDefinitions={visibleColumns}
            orderBy={orderBy}
            orderDirection={orderDirection}
            allRowsAreSelected={allRowsAreSelected}
            setSelectedStateForRows={setSelectedStateForRows}
            optionalColumns={optionalColumns}
            availableColumnDefinitions={availableColumns}
            onColumnChecked={onColumnChecked}
          />
        </Thead>
        <Tbody>
          {!isLoading && !hasItems && (
            <EmptyContent
              cols={visibleColumns.length}
              size={size}
              renderNoDataAvailable={renderNoDataAvailable}
              noDataMessage={noDataMessage}
            />
          )}
          {hasItems &&
            items.map((item, i) => (
              <Row
                key={item.id || i}
                item={item}
                size={size}
                columnDefinitions={visibleColumns}
                cellOpts={props}
                onMouseEnter={onRowMouseEnter}
                onMouseLeave={onRowMouseLeave}
                getRowProps={getRowProps}
                onRowClick={onRowClick}
              />
            ))}
          {isLoading && (
            <LoadingRows cols={visibleColumns.length} progress={progress} numSkeletonRows={numSkeletonRows} />
          )}
          {hasErrors && <ErrorRows cols={visibleColumns.length} errors={errors} size={size} />}
          {
            <LoadMoreRow
              cols={visibleColumns.length}
              loadMore={canLoadMore && loadMore}
              label={loadMoreLabel}
              filterBy={filterBy}
              filterByLabel={t('in-components:tables.serverTable.cursorPaginatedTableFilterByLabel')}
              filterByHref={filterByHref}
            />
          }
        </Tbody>
      </Table>
    </Fragment>
  );
}

function LoadMoreRow({
  depth,
  cols,
  loadMore,
  label = t('in-components:tables.serverTable.cursorPaginatedTableLoadMoreRowLabel'),
  size,
  className,
  filterBy,
  filterByLabel,
  filterByHref
}) {
  const filterByCols = loadMore ? cols - 2 : cols;
  const supportsFilterBy = Boolean(filterByHref || filterBy);
  const loadMoreCols = supportsFilterBy ? cols - filterByCols : cols;
  return (
    <Tr depth={depth} size={size} className={className}>
      {supportsFilterBy && (
        <ActionColumn cols={filterByCols} action={filterBy} actionHref={filterByHref} label={filterByLabel} />
      )}
      {loadMore && <ActionColumn cols={loadMoreCols} action={loadMore} label={label} />}
    </Tr>
  );
}
