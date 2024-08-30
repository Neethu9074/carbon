/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';
import invariant from 'invariant';
import { debounce } from 'lodash';

import { TableSkeleton as CarbonTableSkeleton, Pagination as CarbonPagination } from '@instana/components';
import { TableErrorRows, Table, Tbody, Thead } from '@instana/legacy';
import { DataTable as CarbonDataTable } from '@instana/components';
import { Card, SearchInput } from '@instana/components';

import { filterColumns } from 'in-components/tables/ServerTable/internalComponents/columnBehavior';
import EmptyContent from 'in-components/tables/ServerTable/internalComponents/EmptyContent';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import LoadingRows from 'in-components/tables/ServerTable/internalComponents/LoadingRows';
import Columns from 'in-components/tables/ServerTable/internalComponents/Columns';
import { TableProps, TableState } from 'in-components/tables/ServerTable/types';
import { Nullish, PaginatedResult, Result, ResultPrecision } from 'in-types';
import Row from 'in-components/tables/ServerTable/internalComponents/Row';
import { carbonPaginationEnabled } from 'in-services/featureFlags';
import { noop, pendingResult } from 'in-services/fixedObjects';
import { hasError, isLoading } from 'in-services/util/result';
import { carbonTableEnabled } from 'in-services/featureFlags';
import Pagination from 'in-components/Pagination';
import { OrderDirection } from 'in-types';
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
    searchPlaceholder,
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

  if (carbonTableEnabled) {
    let carbonHeaders: Array<any> = [];

    const debounceOnChange = debounce((searchInput: string) => {
      if (searchInput !== undefined) {
        onChange({ query: searchInput, orderBy, orderDirection, page: 1, pageSize });
      }
    }, 500);

    const filterRows = (searchInputText: string) => {
      debounceOnChange(searchInputText);
    };

    carbonHeaders = visibleColumns.map((item, i) => ({
      key: item?.id || i,
      header: item?.label,
      isSortable: item.sortable ?? true,
      getContent: item.getContent,
      sortDirection: item?.id === orderBy ? (orderDirection === 'ASC' ? 'ASC' : 'DESC') : 'NONE'
    }));

    let header;
    if (rightHeader) {
      header = (
        <div className={locals.carbonRightHeader}>
          {typeof rightHeader === 'function' ? rightHeader(props) : rightHeader}
        </div>
      );
    }

    const leftHeaderContent =
      resultPrecision === 'PRECISION_APPROXIMATE' ? (
        <MultiLineToolTipIcon lines={[t('in-components:approximateDataIndicator.dataRetention')]} />
      ) : undefined;

    if (isLoading(result)) {
      // when loading , waiting for api to return data
      body = (
        <CarbonTableSkeleton headers={carbonHeaders} columnCount={visibleColumns?.length} rowCount={3} showToolbar />
      );
    } else if (hasError(result)) {
      // when api returns error
      body = (
        <div className={locals.emptyTable}>
          <CarbonDataTable headers={carbonHeaders} rows={[]} />
          <TableErrorRows cols={visibleColumns.length} errors={result.errors} size={size} />
        </div>
      );
    } else if (result.data?.items?.length === 0) {
      // when api returns no data
      body = (
        <div className={locals.emptyTable}>
          <CarbonDataTable
            headers={carbonHeaders}
            rows={[]}
            filterRows={(value: React.ChangeEvent<HTMLInputElement>) => {
              filterRows(value?.target?.value);
            }}
            searchText={query}
          />
          <EmptyContent
            cols={visibleColumns?.length}
            size={size}
            renderNoDataAvailable={renderNoDataAvailable}
            noDataMessage={noDataMessage}
          />
        </div>
      );
    } else {
      // when api has returned data
      const carbonRows = result.data!.items.map((item: ItemType, index: number) => {
        let value = { id: item.id ?? String(index) };
        carbonHeaders.map(({ key, getContent }) => {
          const pair = { [key]: <>{getContent(item, props, key)}</> };
          value = { ...value, ...pair };
          return value;
        });
        return value;
      });

      body = (
        <CarbonDataTable
          headers={carbonHeaders}
          rows={carbonRows}
          filterRows={(value: React.ChangeEvent<HTMLInputElement>) => {
            filterRows(value?.target?.value);
          }}
          sortRow={(sortState: { sortHeaderKey: string; sortDirection: string }) => {
            let orderBy = sortState.sortHeaderKey;
            let orderDirection = sortState.sortDirection as OrderDirection;
            // backend APIs as of now doesnt support NONE sort direction option, so will be
            // changing it to ASC to maintain the current behaviour.
            if (sortState.sortDirection === 'NONE' || sortState.sortDirection === 'DESC') {
              orderDirection = 'ASC';
            } else if (sortState.sortDirection === 'ASC') {
              orderDirection = 'DESC';
            }
            onChange({ query, orderBy, orderDirection, page: 1, pageSize });
          }}
          searchText={query}
          isSearchEnabled={isSearchable}
        />
      );
    }

    return (
      <Card
        title={cardTitle}
        leftHeaderContent={cardTitle ? leftHeaderContent : undefined}
        rightHeaderContent={cardTitle ? header : undefined}
        className={classNames(
          {
            [locals.shadowless]: shadowless
          },
          cardTitle ? locals.carbonTitle : locals.carbonNoTitle
        )}
      >
        <Fragment>
          {/* when the left header is passed as prop and not title , existing code support */}
          {!cardTitle && header && (
            <div className={classNames(locals.carbonHeader)}>
              <div className={classNames(locals.carbonLeftHeader)}>{leftHeader || <span>&nbsp;</span>}</div>
              {header}
            </div>
          )}
          {/* Carbon Table */}
          {body}
          {/* Pagination */}
          {result.data && result.data.totalHits > result.data.pageSize ? (
            <CarbonPagination
              currentPage={page}
              totalItems={result?.data?.totalHits}
              pageSize={pageSize}
              pageSizes={[pageSize]}
              onChange={data => {
                onChange({ query, orderBy, orderDirection, page: data.page, pageSize });
              }}
            />
          ) : null}
        </Fragment>
      </Card>
    );
  }
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
    const totalItems = result.data.totalHits;
    pagination = renderPagination ? (
      renderPagination({
        page,
        totalItems,
        numPages,
        orderDirection,
        onChange,
        pageSize,
        query,
        orderBy
      })
    ) : (
      <div className={locals.paginationWrapper}>
        {carbonPaginationEnabled ? (
          <CarbonPagination
            currentPage={page}
            totalItems={result.data.totalHits}
            pageSize={result.data.pageSize}
            pageSizes={[result.data.pageSize]}
            onChange={(data: { page: number; pageSize: number }) => {
              return onChange({ query, orderBy, orderDirection, page: data.page, pageSize });
            }}
          />
        ) : (
          <Pagination
            currentPage={page}
            numPages={numPages}
            onChange={page => onChange({ query, orderBy, orderDirection, page, pageSize })}
          />
        )}
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
