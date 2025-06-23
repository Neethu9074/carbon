/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, HorizontalIndicator, Stack } from '@instana/components';

import { filterColumns } from 'in-components/tables/ServerTable/internalComponents/columnBehavior';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function CursorPaginatedTable(props) {
  const {
    // values configurable via the table
    orderBy,
    orderDirection,

    progress,
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

  const { visibleColumns } = filterColumns(props);

  const visColumns = visibleColumns.map(header => {
    // seeing this one off case where the label has data object
    // the code will break when header.label has object
    // so converting to the format thats needed.
    const newHeader = { ...header };
    if (header?.label?.data) {
      newHeader.label = isLoading ? { data: undefined } : header.label.data;
    }
    return newHeader;
  });

  return (
    <>
      <ServerTablePresenter
        {...props}
        pendingResult={pendingResult}
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
        useMaxAvailableHeight={false}
        result={!isLoading || items?.length > 0 ? { data: { items } } : undefined}
      />
      {isLoading && <HorizontalIndicator progress={progress} />}
      <TableLoadMoreRow
        cols={visibleColumns.length}
        loadMore={canLoadMore && loadMore}
        label={loadMoreLabel}
        filterByOnClick={filterByOnClick}
        filterByLabel={t('in-components:tables.serverTable.cursorPaginatedTableFilterByLabel')}
        filterByHref={filterByHref}
      />
    </>
  );
}

function TableLoadMoreRow({
  loadMore,
  label = t('in-components:tables.serverTable.cursorPaginatedTableLoadMoreRowLabel'),
  filterByOnClick,
  filterByLabel,
  filterByHref
}) {
  const supportsFilterBy = Boolean(filterByHref || filterByOnClick);

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
