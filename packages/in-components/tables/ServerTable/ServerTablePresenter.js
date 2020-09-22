import React, { Fragment } from 'react';
import invariant from 'invariant';

import { filterColumns } from 'in-components/tables/ServerTable/internalComponents/columnBehavior';
import EmptyContent from 'in-components/tables/ServerTable/internalComponents/EmptyContent';
import LoadingRows from 'in-components/tables/ServerTable/internalComponents/LoadingRows';
import { ErrorRows, Table, Tbody, Thead } from 'in-components/tables/sharedComponents';
import Columns from 'in-components/tables/ServerTable/internalComponents/Columns';
import Row from 'in-components/tables/ServerTable/internalComponents/Row';
import { joinClassNames } from 'in-services/util/classnames';
import { pendingResult } from 'in-services/fixedObjects';
import SearchInput from 'in-new-components/SearchInput';
import Pagination from 'in-new-components/Pagination';
import ScrollHints from 'in-components/ScrollHints';
import Card from 'in-new-components/Card';

import locals from './ServerTablePresenter.mless';

export default function ServerTablePresenter(props) {
  const {
    // custom classnames
    headerClassName,

    // values configurable via the table
    query,
    page,
    orderBy,
    orderDirection,
    pageSize,

    getRowProps,
    onRowClick,
    result = pendingResult,
    renderPagination,
    fixedLayout,
    scrollWrapperClassName,
    rightHeader,
    leftHeader,
    numSkeletonRows = 3,
    isSearchable = true,
    searchPlaceholder = '',
    searchMaxWidth,
    size = 'regular',
    cardTitle,
    tableInCard = false,
    noDataMessage,
    allRowsAreSelected = false,
    setSelectedStateForRows,
    renderNoDataAvailable,
    scopeNotification,

    // events
    onChange,
    onRowMouseEnter = () => {},
    onRowMouseLeave = () => {}
  } = props;
  const isLoading = result.progress.loading;
  const hasErrors = result.errors.length > 0;

  const { availableColumns, visibleColumns, optionalColumns, onColumnChecked } = filterColumns(props);

  let body = null;
  if (isLoading) {
    body = <LoadingRows cols={visibleColumns.length} progress={result.progress} numSkeletonRows={numSkeletonRows} />;
  } else if (hasErrors) {
    body = <ErrorRows cols={visibleColumns.length} errors={result.errors} size={size} />;
  } else if (result.data.items.length === 0) {
    body = (
      <EmptyContent
        cols={visibleColumns.length}
        size={size}
        renderNoDataAvailable={renderNoDataAvailable}
        noDataMessage={noDataMessage}
      />
    );
  } else {
    body = result.data.items.map((item, i) => (
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
    ));
  }

  const tableElement = (
    <Table fixedLayout={fixedLayout} tableInCard={tableInCard || cardTitle != null}>
      <Thead>
        <Columns
          setOrder={(orderBy, orderDirection) => onChange({ query, orderBy, orderDirection, page: 1, pageSize })}
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
      <Tbody>{body}</Tbody>
    </Table>
  );
  let content = scrollWrapperClassName ? (
    <ScrollHints
      className={scrollWrapperClassName}
      contentChangeMarker={
        /*
         * Triggers a re-render when the number of rows change (which is necessary because the height of the content
         * will change).
         */
        result.data && result.data.items ? result.data.items.length : 0
      }
    >
      {tableElement}
    </ScrollHints>
  ) : (
    tableElement
  );

  let header;
  if (isSearchable || rightHeader) {
    header = (
      <div className={locals.rightHeader}>
        {typeof rightHeader === 'function' ? rightHeader(props) : rightHeader}
        {isSearchable && (
          <SearchInput
            maxWidth={searchMaxWidth ? searchMaxWidth : 140}
            query={query}
            placeholder={searchPlaceholder}
            onChange={query => onChange({ query, orderBy, orderDirection, page: 1, pageSize })}
          />
        )}
      </div>
    );
  }

  let pagination = null;
  if (result.data && result.data.totalHits > result.data.pageSize) {
    const numPages = Math.ceil(result.data.totalHits / result.data.pageSize);
    pagination = renderPagination ? (
      renderPagination({
        page,
        numPages,
        orderDirection,
        onChange,
        pageSize,
        query,
        orderBy
      })
    ) : (
      <div className={locals.paginationWrapper}>
        <Pagination
          currentPage={page}
          numPages={numPages}
          onChange={page => onChange({ query, orderBy, orderDirection, page, pageSize })}
        />
      </div>
    );
  }

  let scope;
  if (scopeNotification) {
    scope = scopeNotification;
  }

  if (cardTitle != null) {
    if (__DEV__) {
      invariant(
        leftHeader == null,
        'Specifying a left header is not compatible with presentation of a table as a card.'
      );
    }
    return (
      <Card title={cardTitle} header={header} withoutPadding>
        {content}
        {pagination}
      </Card>
    );
  }
  return (
    <Fragment>
      {header && (
        <div className={joinClassNames(locals.header, headerClassName)}>
          {leftHeader || <span>&nbsp;</span>}
          {header}
        </div>
      )}
      {scope}
      {content}
      {pagination}
    </Fragment>
  );
}
