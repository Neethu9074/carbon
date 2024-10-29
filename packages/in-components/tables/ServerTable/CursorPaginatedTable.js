/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { TableActionColumn, TableErrorRows, Table, Tbody, Thead, Tr } from '@instana/legacy';
import { Button, Stack } from '@instana/components';

import { filterColumns } from 'in-components/tables/ServerTable/internalComponents/columnBehavior';
import EmptyContent from 'in-components/tables/ServerTable/internalComponents/EmptyContent';
import LoadingRows from 'in-components/tables/ServerTable/internalComponents/LoadingRows';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import Columns from 'in-components/tables/ServerTable/internalComponents/Columns';
import Row from 'in-components/tables/ServerTable/internalComponents/Row';
import { carbonTableEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

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
    filterByOnClick,
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

  /**
   * Carbon datatable migration START
   */

  if (carbonTableEnabled) {
    const visColumns = visibleColumns.map(header => {
      // seeing this one off case where the label has data object
      // the code will break when header.label has object
      // so converting to the format thats needed.
      const newHeader = { ...header };
      if (header?.label?.data) {
        newHeader.label = header.label.data;
      }
      return newHeader;
    });

    return (
      <Fragment>
        <ServerTablePresenter
          {...props}
          columnDefinitions={visColumns}
          orderBy={orderBy}
          orderDirection={orderDirection}
          getRowProps={getRowProps}
          onRowClick={onRowClick}
          fixedLayout={fixedLayout}
          numSkeletonRows={numSkeletonRows}
          isSearchable={false}
          size={size}
          cardTitle={cardTitle}
          tableInCard={tableInCard}
          noDataMessage={noDataMessage}
          allRowsAreSelected={allRowsAreSelected}
          setSelectedStateForRows={setSelectedStateForRows}
          renderNoDataAvailable={renderNoDataAvailable}
          onChange={onChange}
          onRowMouseEnter={onRowMouseEnter}
          onRowMouseLeave={onRowMouseLeave}
          result={isLoading ? null : { data: { items } }}
        />
        <TableLoadMoreRow
          cols={visibleColumns.length}
          loadMore={canLoadMore && loadMore}
          label={loadMoreLabel}
          filterByOnClick={filterByOnClick}
          filterByLabel={t('in-components:tables.serverTable.cursorPaginatedTableFilterByLabel')}
          filterByHref={filterByHref}
        />
      </Fragment>
    );
  }

  /**
   * Carbon datatable migration END
   */

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
                key={`${item.id}_${i}`}
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
          {hasErrors && <TableErrorRows cols={visibleColumns.length} errors={errors} size={size} />}
          {
            <TableLoadMoreRow
              cols={visibleColumns.length}
              loadMore={canLoadMore && loadMore}
              label={loadMoreLabel}
              filterByOnClick={filterByOnClick}
              filterByLabel={t('in-components:tables.serverTable.cursorPaginatedTableFilterByLabel')}
              filterByHref={filterByHref}
            />
          }
        </Tbody>
      </Table>
    </Fragment>
  );
}

function TableLoadMoreRow({
  depth,
  cols,
  loadMore,
  label = t('in-components:tables.serverTable.cursorPaginatedTableLoadMoreRowLabel'),
  size,
  className,
  filterByOnClick,
  filterByLabel,
  filterByHref
}) {
  const filterByCols = loadMore ? cols - 2 : cols;
  const supportsFilterBy = Boolean(filterByHref || filterByOnClick);
  const loadMoreCols = supportsFilterBy ? cols - filterByCols : cols;

  if (carbonTableEnabled) {
    return (
      <Stack distribution="spaceEvenly" direction="horizontal">
        {supportsFilterBy && (
          <Button kind="action" onClick={filterByOnClick} href={filterByHref}>
            {filterByLabel}
          </Button>
        )}
        {loadMore && (
          <Button kind="action" onClick={loadMore}>
            {label}
          </Button>
        )}
      </Stack>
    );
  }
  return (
    <Tr depth={depth} size={size} className={className}>
      {supportsFilterBy && (
        <TableActionColumn cols={filterByCols} onClick={filterByOnClick} href={filterByHref} label={filterByLabel} />
      )}
      {loadMore && <TableActionColumn cols={loadMoreCols} onClick={loadMore} label={label} />}
    </Tr>
  );
}
