/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
import invariant from 'invariant';
import { debounce } from 'lodash';

import { Pagination as CarbonPagination, Checkbox, DataTable as CarbonDataTable } from '@instana/components';
import { TableErrorRows, Table, Tbody, Thead } from '@instana/legacy';
import { Card, SearchInput } from '@instana/components';
import { OrderDirection } from '@instana/types';

import { filterColumns } from 'in-components/tables/ServerTable/internalComponents/columnBehavior';
import { ColumnDefinition, TableProps, TableState } from 'in-components/tables/ServerTable/types';
import EmptyContent from 'in-components/tables/ServerTable/internalComponents/EmptyContent';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import LoadingRows from 'in-components/tables/ServerTable/internalComponents/LoadingRows';
import { ConfigureButton } from 'in-components/tables/sharedComponents/ConfigurableTh';
import { carbonSortHandler } from 'in-components/tables/ServerTable/carbonSortHandler';
import Columns from 'in-components/tables/ServerTable/internalComponents/Columns';
import { Nullish, PaginatedResult, Result, ResultPrecision } from 'in-types';
import Row from 'in-components/tables/ServerTable/internalComponents/Row';
import { noop, pendingResult } from 'in-services/fixedObjects';
import { carbonTableEnabled } from 'in-services/featureFlags';
import { hasError, isLoading } from 'in-services/util/result';
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
  pageSizes?: Array<number>;
  result?: Result<PaginatedResult<ItemType>> | Nullish;
  renderPagination?: (p: TableState) => ReactNode;
  fixedLayout?: boolean;
  isScrollableTable?: boolean;
  searchWidth?: string | number;
  rightHeader?: ((p: ServerTablePresenterProps<ItemType>) => ReactNode) | ReactNode;
  leftHeader?: ReactNode;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  withoutSearchIcon?: boolean;
  searchMaxWidth?: string | number;
  scopeNotification?: ReactNode;
  resultPrecision?: ResultPrecision;
  shadowless?: boolean;
  useMaxAvailableHeight?: boolean;
  toolBarContent?: ReactElement;
}

export interface CarbonHeader<
  ITEM_TYPE extends Object,
  PROPS_TYPE extends TableProps<ITEM_TYPE> = TableProps<ITEM_TYPE>
> {
  key: string;
  header: string | ReactNode;
  isSortable?: boolean;
  getContent: ColumnDefinition<ITEM_TYPE, PROPS_TYPE>['getContent'];
  sortDirection?: OrderDirection | 'NONE';
  defaultOrderDirection?: OrderDirection;
  noWrap?: boolean;
  ellipsis?: boolean;
  width?: string | number;
  useMinimumAmountOfHorizontalSpace?: boolean;
  widthInAbsoluteUnit?: boolean;
  selectAllCheckbox?: boolean;
}

type CarbonHeaders<ITEM_TYPE extends Object, PROPS_TYPE extends TableProps<ITEM_TYPE> = TableProps<ITEM_TYPE>> = Array<
  CarbonHeader<ITEM_TYPE, PROPS_TYPE>
>;

interface CarbonRow {
  id: string;
  [key: string]: string | ReactNode;
}

type CarbonRows = Array<CarbonRow>;

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
    pageSizes,
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
    useMaxAvailableHeight = true,
    // events
    onChange = noop,
    onRowMouseEnter = noop,
    onRowMouseLeave = noop,
    toolBarContent
  } = props;
  const result = props.result ?? (pendingResult as Result<PaginatedResult<ItemType>>);
  const { availableColumns, visibleColumns, optionalColumns, onColumnChecked } = filterColumns(props);
  let body = null;
  let defaultPageSize = pageSizes?.[0] ?? pageSize;

  if (carbonTableEnabled) {
    const debounceOnChange = debounce((searchInput: string) => {
      if (searchInput !== undefined) {
        onChange({ query: searchInput, orderBy, orderDirection, page: 1, pageSize, pageSizes });
      }
    }, 500);

    const filterRows = (searchInputText: string) => {
      debounceOnChange(searchInputText);
    };

    const getEllipsisValue = (ellipsis: string | boolean | undefined, width: string | number | undefined) => {
      if (typeof ellipsis === 'string' || (width !== 'undefined' && ellipsis !== undefined)) {
        ellipsis = true;
      }
      if (ellipsis === undefined) {
        ellipsis = false;
      }
      return ellipsis;
    };

    const getWidthValue = (ellipsis: string | boolean | undefined, width: string | number | undefined) => {
      if (typeof ellipsis === 'string') {
        width = ellipsis;
      }
      return width;
    };

    const getWidthInAbsoluteUnit = (
      ellipsis: string | boolean | undefined,
      widthInAbsoluteUnit: boolean | undefined
    ) => {
      if (typeof ellipsis === 'string') {
        widthInAbsoluteUnit = true;
      }
      return widthInAbsoluteUnit;
    };

    const getHeader = (item: ColumnDefinition<ItemType, PropsType>) => {
      if (item.renderLabel) {
        const label = typeof item.label === 'string' ? ({ data: item.label } as unknown as string) : item.label;
        return item.renderLabel({ ...item, label });
      }
      return item.label;
    };

    const carbonHeaders: CarbonHeaders<ItemType, PropsType> = visibleColumns.map((item, i) => ({
      key: item?.id || String(i),
      header: getHeader(item) ?? '',
      isSortable: item.sortable ?? true,
      getContent: item.getContent,
      sortDirection: item?.id === orderBy ? (orderDirection === 'ASC' ? 'ASC' : 'DESC') : 'NONE',
      defaultOrderDirection: item.defaultOrderDirection,
      noWrap: item.noWrap ?? false,
      ellipsis: getEllipsisValue(item.ellipsis, item.width),
      width: getWidthValue(item.ellipsis, item.width),
      useMinimumAmountOfHorizontalSpace: item.useMinimumAmountOfHorizontalSpace ?? false,
      widthInAbsoluteUnit: getWidthInAbsoluteUnit(item.ellipsis, item.widthInAbsoluteUnit) ?? false,
      selectAllCheckbox: item.selectAllCheckbox ?? false
    }));

    // for checkbox in header for selectable tables
    // checkbox is always the first column in table.
    if (carbonHeaders?.[0]?.selectAllCheckbox) {
      carbonHeaders[0].header = (
        <Checkbox
          checked={allRowsAreSelected}
          onChange={() => setSelectedStateForRows?.(!allRowsAreSelected)}
          size="large"
        />
      );
      carbonHeaders[0].width = '2.5rem';
    }

    // For customised column header where user can select which column to render.
    // A checklist containing all the header names to choose to rendere is got from
    // the below component.
    const isConfigurationColumn = optionalColumns && optionalColumns.length;
    const toolBar = isConfigurationColumn ? (
      <>
        <ConfigureButton
          columnDefinitions={visibleColumns}
          availableColumnDefinitions={availableColumns}
          onColumnChecked={onColumnChecked}
        />
        {toolBarContent}
      </>
    ) : (
      toolBarContent
    );

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

    // when api has returned data
    const carbonRows: CarbonRows =
      result.data?.items.map((item: ItemType, index: number) => {
        const idObj = { id: item.id ?? String(index) };
        const newRow = carbonHeaders.map(({ key, getContent, ellipsis, noWrap, useMinimumAmountOfHorizontalSpace }) => {
          const newWidth = typeof ellipsis !== 'boolean' ? ellipsis : null;
          const content = newWidth
            ? {
                //get column name from carbonHeader and its value from results
                [key]: (
                  <div
                    className={classNames({
                      [locals.tableTdNoWrap]: noWrap,
                      [locals.tableMinimumHorizontalSpace]: useMinimumAmountOfHorizontalSpace
                    })}
                  >
                    {getContent(item, props, key)}
                  </div>
                )
              }
            : { [key]: getContent(item, props, key) };
          return content;
        });
        const carbonRow: CarbonRow = Object.assign({}, ...newRow, idObj);
        return carbonRow;
      }) ?? [];

    const sortRow = carbonSortHandler(carbonHeaders, onChange, query, pageSize, pageSizes);

    body = (
      <CarbonDataTable
        loading={Boolean(isLoading(result))}
        headers={carbonHeaders}
        rows={carbonRows}
        filterRows={(value: React.ChangeEvent<HTMLInputElement>) => {
          filterRows(value?.target?.value);
        }}
        sortRow={sortRow}
        searchText={query}
        isSearchEnabled={isSearchable}
        onClickingRow={onRowClick}
        tableInCard={tableInCard || cardTitle != null}
        fixedLayout={fixedLayout}
        results={result.data?.items}
        toolBarContent={toolBar}
      />
    );

    const emptyContent = carbonRows.length == 0 && !isLoading(result);
    return (
      <Card
        disableLayer={!tableInCard}
        title={cardTitle}
        useMaxAvailableHeight={useMaxAvailableHeight}
        leftHeaderContent={cardTitle ? leftHeaderContent : undefined}
        rightHeaderContent={cardTitle ? header : undefined}
        className={classNames(
          {
            [locals.shadowless]: shadowless,
            [locals.noPadding]: !tableInCard
          },
          cardTitle ? locals.carbonTitle : locals.carbonNoTitle
        )}
      >
        {scopeNotification}
        <>
          {/* when the left header is passed as prop and not title , existing code support */}
          {!cardTitle && header && (
            <div className={classNames(locals.carbonHeader)}>
              <div className={classNames(locals.carbonLeftHeader)}>{leftHeader || <span>&nbsp;</span>}</div>
              {header}
            </div>
          )}
          {/* Carbon Table */}
          {body}
          {/* Empty Content */}
          {emptyContent && !hasError(result) && (
            <div className={locals.emptyTable}>
              <EmptyContent
                cols={visibleColumns?.length}
                size={size}
                renderNoDataAvailable={renderNoDataAvailable}
                noDataMessage={noDataMessage}
              />
            </div>
          )}
          {/* Error */}
          {hasError(result) && (
            <div className={locals.emptyTable}>
              <TableErrorRows cols={visibleColumns.length} errors={result.errors} size={size} />
            </div>
          )}
          {/* Pagination */}
          {result.data && result.data.totalHits > defaultPageSize ? (
            renderPagination ? (
              renderPagination({
                page,
                totalItems: result?.data?.totalHits,
                numPages: Math.ceil(result.data.totalHits / result.data.pageSize),
                orderDirection,
                onChange,
                pageSize,
                pageSizes,
                query,
                orderBy
              })
            ) : (
              <CarbonPagination
                currentPage={page}
                totalItems={result?.data?.totalHits}
                pageSize={pageSize}
                pageSizes={pageSizes ?? [pageSize]}
                onChange={data => {
                  onChange({ query, orderBy, orderDirection, page: data.page, pageSize: data.pageSize, pageSizes });
                }}
              />
            )
          ) : null}
        </>
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
  if (result.data && result.data.totalHits > defaultPageSize) {
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
        pageSizes,
        query,
        orderBy
      })
    ) : (
      <div className={locals.paginationWrapper}>
        <CarbonPagination
          currentPage={page}
          totalItems={result.data.totalHits}
          pageSize={result.data.pageSize}
          pageSizes={pageSizes ?? [result.data.pageSize]}
          onChange={(data: { page: number; pageSize: number }) => {
            return onChange({ query, orderBy, orderDirection, page: data.page, pageSize: data.pageSize, pageSizes });
          }}
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
        useMaxAvailableHeight={useMaxAvailableHeight}
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
    <>
      {header && (
        <div className={classNames(locals.header, headerClassName)}>
          {leftHeader || <span>&nbsp;</span>}
          {header}
        </div>
      )}
      {scopeNotification}
      {tableElement}
      {pagination}
    </>
  );
}
