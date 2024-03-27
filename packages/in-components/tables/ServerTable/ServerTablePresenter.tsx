/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';
import invariant from 'invariant';

import { TableErrorRows, Table, Tbody, Thead } from '@instana/legacy';
import { Card } from '@instana/components';

import { filterColumns } from 'in-components/tables/ServerTable/internalComponents/columnBehavior';
import EmptyContent from 'in-components/tables/ServerTable/internalComponents/EmptyContent';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import LoadingRows from 'in-components/tables/ServerTable/internalComponents/LoadingRows';
import Columns from 'in-components/tables/ServerTable/internalComponents/Columns';
import { TableProps, TableState } from 'in-components/tables/ServerTable/types';
import { Nullish, PaginatedResult, Result, ResultPrecision } from 'in-types';
import Row from 'in-components/tables/ServerTable/internalComponents/Row';
import { noop, pendingResult } from 'in-services/fixedObjects';
import { hasError, isLoading } from 'in-services/util/result';
import SearchInput from 'in-components/SearchInput';
import Pagination from 'in-components/Pagination';
import { t } from 'in-i18n';

import locals from './ServerTablePresenter.mless';

export interface ListItem extends Object {
  id?: string;
}

export interface ServerTablePresenterProps<ItemType extends ListItem> extends TableProps<ItemType> {
  headerClassName?: string;
  query?: string;
  page: number;
  pageSize: number;
  result?: Result<PaginatedResult<ItemType>> | Nullish;
  renderPagination?: (p: TableState) => React.ReactNode;
  fixedLayout?: boolean;
  isScrollableTable?: boolean;
  searchWidth?: string | number;
  rightHeader?: ((p: ServerTablePresenterProps<ItemType>) => React.ReactNode) | React.ReactNode;
  leftHeader?: React.ReactNode;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  withoutSearchIcon?: boolean;
  searchMaxWidth?: string | number;
  scopeNotification?: React.ReactNode;
  resultPrecision?: ResultPrecision;
  shadowless?: boolean;
}

export default function ServerTablePresenter<
  ItemType extends ListItem,
  PropsType extends ServerTablePresenterProps<ItemType>
>(props: PropsType) {
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
    renderPagination,
    searchWidth,
    fixedLayout,
    isScrollableTable = true,
    rightHeader,
    leftHeader,
    numSkeletonRows = 3,
    isSearchable = true,
    searchPlaceholder = '',
    searchMaxWidth,
    withoutSearchIcon = false,
    size = 'regular',
    cardTitle,
    tableInCard = false,
    noDataMessage,
    allRowsAreSelected = false,
    setSelectedStateForRows,
    renderNoDataAvailable,
    scopeNotification,
    resultPrecision,
    shadowless,

    // events
    onChange = noop,
    onRowMouseEnter = noop,
    onRowMouseLeave = noop
  } = props;
  const result = props.result ?? (pendingResult as Result<PaginatedResult<ItemType>>);
  const { availableColumns, visibleColumns, optionalColumns, onColumnChecked } = filterColumns(props);

  let body = null;

  if (isLoading(result)) {
    body = <LoadingRows cols={visibleColumns.length} progress={result.progress} numSkeletonRows={numSkeletonRows} />;
  } else if (hasError(result)) {
    body = (
      <>
        <TableErrorRows cols={visibleColumns.length} errors={result.errors} size={size} />
      </>
    );
  } else if (result?.data?.items?.length === 0) {
    body = (
      <EmptyContent
        cols={visibleColumns.length}
        size={size}
        renderNoDataAvailable={renderNoDataAvailable}
        noDataMessage={noDataMessage}
      />
    );
  } else {
    body = result.data!.items.map((item, i) => (
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
    <div className={classNames({ [locals.scrollableTable]: isScrollableTable })}>
      <Table fixedLayout={fixedLayout} tableInCard={tableInCard || cardTitle != null} className="">
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
    </div>
  );

  let header;
  if (isSearchable || rightHeader) {
    header = (
      <div className={locals.rightHeader}>
        {typeof rightHeader === 'function' ? rightHeader(props) : rightHeader}
        {isSearchable && (
          <SearchInput
            maxWidth={searchMaxWidth ?? 140}
            query={query}
            width={searchWidth}
            placeholder={searchPlaceholder}
            withoutIcon={withoutSearchIcon}
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

  const leftHeaderContent =
    resultPrecision === 'PRECISION_APPROXIMATE' ? (
      <MultiLineToolTipIcon lines={[t('in-components:approximateDataIndicator.dataRetention')]} />
    ) : undefined;

  if (cardTitle != null) {
    if (__DEV__) {
      invariant(
        leftHeader == null,
        'Specifying a left header is not compatible with presentation of a table as a card.'
      );
    }
    return (
      <Card
        title={cardTitle}
        leftHeaderContent={leftHeaderContent}
        rightHeaderContent={header}
        className={classNames({
          [locals.shadowless]: shadowless
        })}
      >
        {scopeNotification}
        {tableElement}
        {pagination}
      </Card>
    );
  }

  return (
    <Fragment>
      {header && (
        <div className={classNames(locals.header, headerClassName)}>
          {leftHeader || <span>&nbsp;</span>}
          {header}
        </div>
      )}
      {scopeNotification}
      {tableElement}
      {pagination}
    </Fragment>
  );
}
