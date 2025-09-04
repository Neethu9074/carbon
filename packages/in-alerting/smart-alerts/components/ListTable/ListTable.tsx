/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { find, debounce, isEmpty, reverse, sortBy } from 'lodash';
import React, { ReactNode, useEffect, useState } from 'react';

import {
  DataTable,
  Stack,
  Pagination,
  IconButton,
  CarbonTableToolbar,
  CarbonTableToolbarSearch
} from '@instana/components';
import { NoDataEmptyState } from '@instana/ibm-products';
import { Observable } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { OrderDirection } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getFilterByResults } from 'in-alerting/smart-alerts/components/list/ListHelper';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { ColumnDefinition, TableActions } from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/ListTable/ListDataTable.mless';

interface CarbonHeader<ITEM_TYPE extends Object> {
  key: string;
  header: string | ReactNode;
  isSortable?: boolean;
  getContent: ColumnDefinition<ITEM_TYPE>['getContent'];
  sortDirection?: OrderDirection | 'NONE';
}

interface CarbonRow {
  id: string;
  [key: string]: string | JSX.Element;
}

type CarbonHeaders<ITEM_TYPE extends Object> = Array<CarbonHeader<ITEM_TYPE>>;

type CarbonRows = Array<CarbonRow>;

interface ListDataTableProps<ItemType extends Object> {
  loadEntities: () => Observable<ItemType[] | null>;
  columnDefinitions: ColumnDefinition<ItemType>[];
  initialOrderBy: string;
  listPageSize: number;
  pageSizes?: Array<number>;
  title?: React.ReactNode;
  noDataHeader?: string;
  noDataSubHeader?: string;
  noDataDescription?: string;
  rightHeader?: ReactNode;
  tableActions?: TableActions<ItemType>;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  setCount?: React.Dispatch<React.SetStateAction<string | undefined>>;
  toolBarContent?: React.ReactNode;
}

interface TableState {
  orderBy: string;
  orderDirection: string;
  page: number;
  query?: string;
  pageSize: number;
  pageSizes?: Array<number>;
}

export default function ListDataTable<ItemType extends Object>(props: ListDataTableProps<ItemType>) {
  const {
    loadEntities,
    columnDefinitions,
    initialOrderBy,
    listPageSize,
    pageSizes,
    title,
    noDataHeader,
    noDataSubHeader,
    noDataDescription,
    rightHeader,
    tableActions,
    isSearchable,
    searchPlaceholder,
    setCount,
    toolBarContent
  } = props;

  const [{ orderBy, orderDirection, page, query, pageSize }, setState] = useState<TableState>({
    orderBy: initialOrderBy,
    orderDirection: 'NONE',
    page: 1,
    query: undefined,
    pageSize: listPageSize
  });

  const [result, setResult] = useState<ItemType[]>([]);
  const [filterResult, setFilterResult] = useState<ItemType[]>([]);

  let tableColumnDefinitions = addTableActions<ItemType>({
    columnDefinitions,
    tableActions
  });

  const offset = (page - 1) * Number(pageSize);
  const until = offset + Number(pageSize);

  const entities = useObservable(() => loadEntities(), [loadEntities]) as ItemType[];

  useEffect(() => {
    const filterByResult = entities?.length > 0 ? getFilterByResults(entities, query) : [];

    setFilterResult(filterByResult);

    const data =
      filterByResult.length > 0
        ? sortEntities<ItemType>(filterByResult, columnDefinitions, orderBy, orderDirection).slice(offset, until)
        : filterByResult;

    setCount?.(getHeaderWithCount(data.length, entities?.length));
    setResult(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entities, orderBy, orderDirection, offset, until, query, page, pageSize]);

  const debounceOnChange = debounce((searchInput?: string) => {
    if (searchInput !== undefined) {
      setState({
        query: searchInput,
        orderBy,
        orderDirection,
        page: query !== searchInput ? 1 : page,
        pageSize,
        pageSizes
      });
    }
  }, 500);

  const filterRows = (searchInputText?: string) => {
    debounceOnChange(searchInputText);
  };

  if (!entities) {
    return <LoadingList numSkeletonRows={3} />;
  }

  return (
    <ListTable<ItemType>
      columnDefinitions={tableColumnDefinitions}
      result={result}
      title={title}
      filterRows={filterRows}
      onChange={data => {
        setState({
          page: data.page ?? page,
          orderBy: !isEmpty(data.orderBy) ? data.orderBy : orderBy,
          orderDirection: data.orderDirection,
          query: data.query ?? query,
          pageSize: data.pageSize ?? pageSize
        });
      }}
      page={page}
      orderBy={orderBy}
      orderDirection={orderDirection}
      query={query}
      pageSize={pageSize}
      pageSizes={pageSizes}
      noDataHeader={noDataHeader}
      noDataSubHeader={noDataSubHeader}
      noDataDescription={noDataDescription}
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchPlaceholder={searchPlaceholder}
      totalHits={filterResult?.length}
      toolBarContent={toolBarContent}
    />
  );
}

interface ListTableProps<ItemType extends object> extends Object {
  columnDefinitions: ColumnDefinition<ItemType>[];
  result: ItemType[];
  filterRows: (searchInputText?: string) => void;
  onChange: (data: TableState) => void;
  page: number;
  orderBy: string;
  orderDirection: string;
  query?: string;
  pageSize: number;
  totalHits: number;
  title: React.ReactNode;
  pageSizes?: Array<number>;
  noDataHeader?: string;
  noDataSubHeader?: string;
  noDataDescription?: string;
  rightHeader?: ReactNode;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  toolBarContent?: React.ReactNode;
}

function ListTable<ItemType extends object>({
  columnDefinitions,
  result,
  title,
  filterRows,
  onChange,
  page,
  orderBy,
  orderDirection,
  query,
  pageSize,
  pageSizes,
  noDataHeader,
  noDataSubHeader,
  noDataDescription,
  rightHeader,
  isSearchable,
  searchPlaceholder,
  totalHits,
  toolBarContent
}: ListTableProps<ItemType>) {
  const getEllipsisValue = (ellipsis?: string | boolean, width?: string | number) => {
    if (typeof ellipsis === 'string' || (width !== 'undefined' && ellipsis !== undefined)) {
      ellipsis = true;
    }
    if (ellipsis === undefined) {
      ellipsis = false;
    }
    return ellipsis;
  };

  const getWidthValue = (ellipsis?: string | boolean, width?: string | number) => {
    if (typeof ellipsis === 'string') {
      width = ellipsis;
    }
    return width;
  };
  const carbonHeaders: CarbonHeaders<ItemType> = columnDefinitions.map(item => ({
    key: item?.id,
    header: item?.label || '',
    isSortable: item?.sortable ?? false,
    getContent: item?.getContent,
    sortDirection: item?.id === orderBy ? (orderDirection === 'ASC' ? 'ASC' : 'DESC') : 'NONE',
    ellipsis: getEllipsisValue(item.ellipsis, item.width),
    width: getWidthValue(item.ellipsis, item.width)
  }));

  const carbonRows: CarbonRows =
    result?.map?.((item: any, index: number) => {
      const rowId = { id: item.id ?? String(index) };

      // Using reduce to directly build the object
      const carbonRow = carbonHeaders.reduce((acc: any, header: any) => {
        acc[header.key] = header.getContent(item);
        return acc;
      }, rowId); // Start with rowId to include 'id' key

      return carbonRow;
    }) || [];

  let header;
  if (rightHeader) {
    header = <span className={locals.carbonRightHeader}>{rightHeader}</span>;
  }

  return (
    <Stack gap="small">
      {/* Table Title */}
      <Stack direction="horizontal" gap="small" distribution="spaceBetween" align="center">
        {title}
        {header}
      </Stack>

      <span>
        <CarbonTableToolbar>
          {/* Carbon table search bar and Create SA button */}
          {isSearchable && (
            <>
              <CarbonTableToolbarSearch
                defaultExpanded
                expanded
                defaultValue={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement> | '') => filterRows(e ? e?.target?.value : query)}
                labelText={searchPlaceholder}
                placeholder={searchPlaceholder}
              />
              {toolBarContent}
            </>
          )}
        </CarbonTableToolbar>

        {/* Carbon Table */}
        <DataTable
          headers={carbonHeaders}
          rows={carbonRows}
          filterRows={(value: React.ChangeEvent<HTMLInputElement>) => {
            filterRows(value?.target?.value);
          }}
          sortRow={sortState => sortRow(sortState, pageSize, pageSizes, onChange, query)}
          allRowSelected={false}
          isSearchEnabled={false}
        />

        {/* Table Pagination */}
        {totalHits > pageSize && (
          <Pagination
            currentPage={page}
            totalItems={totalHits}
            pageSize={Number(pageSize)}
            pageSizes={pageSizes}
            onChange={data => {
              onChange?.({ query, orderBy, orderDirection, page: data.page, pageSize: data.pageSize, pageSizes });
            }}
          />
        )}
        {/* Empty Content */}
        {carbonRows.length === 0 && (
          <div className={locals.whitebg}>
            <NoDataEmptyState
              title={noDataHeader}
              subtitle={noDataSubHeader}
              illustrationDescription={noDataDescription}
              illustrationPosition="left"
              className={locals.noDataTile}
            />
          </div>
        )}
      </span>
    </Stack>
  );
}

interface SortStateProps {
  sortHeaderKey: string;
  sortDirection: string;
}
function sortRow(
  sortState: SortStateProps,
  pageSize: number,
  pageSizes?: Array<number>,
  onChange?: (data: TableState) => void,
  query?: string
) {
  let orderBy = sortState.sortHeaderKey;
  let orderDirection = sortState.sortDirection;
  if (sortState.sortDirection === 'NONE' || sortState.sortDirection === 'ASC') {
    orderDirection = 'DESC';
  } else if (sortState.sortDirection === 'DESC') {
    orderDirection = 'ASC';
  }
  onChange?.({ query, orderBy, orderDirection, page: 1, pageSize, pageSizes });
}

function addTableActions<ItemType extends object>({
  columnDefinitions,
  tableActions
}: {
  columnDefinitions: ColumnDefinition<ItemType>[];
  tableActions?: TableActions<ItemType>;
}) {
  if (!tableActions) {
    return columnDefinitions;
  }
  let allColumns = columnDefinitions;

  if (tableActions.deselect) {
    allColumns = addDeselectAction<ItemType>(allColumns, tableActions.deselect);
  }

  return allColumns;
}

function addDeselectAction<ItemType extends object>(
  columns: ColumnDefinition<ItemType>[],
  actionDefinition: { deselect: (entity: ItemType) => void }
) {
  return columns.concat({
    id: 'deselectAction',
    sortable: false,
    width: '4rem',
    widthInAbsoluteUnit: true,
    getContent: function Content(entity: ItemType) {
      return (
        <Tooltip content={t('in-settings:components.deselect')} delay={500}>
          <IconButton
            kind="primaryv2"
            type={'lib_openclose_remove_circle_outline'}
            color={themes.default.ids.color.option.blue['500']}
            // Added 'buttonType' to IconButton to fix the default submission when the enter key is pressed from other UI elements on the page. ...
            // gentle remainder : Remove this after carbon is enabled, if possible.
            buttonType="button"
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              actionDefinition.deselect(entity);
            }}
          />
        </Tooltip>
      );
    }
  });
}

function sortEntities<ItemType extends object>(
  entities: ItemType[],
  columnDefinitions: ColumnDefinition<ItemType>[],
  orderByState: string,
  orderDirectionState: string
) {
  //@ts-expect-error Type mismatch
  let sortIteratee: keyof ItemType | ((entity: ItemType) => any) = orderByState;
  const columnDefinition = find(columnDefinitions, definition => definition.id === orderByState);
  if (columnDefinition && columnDefinition.getValue) {
    sortIteratee = columnDefinition.getValue;
  }

  // make sorting case insensitive
  const caseInsensitiveSortIteratee = (entity: ItemType) => {
    let value = null;

    if (typeof sortIteratee === 'string') {
      value = entity[sortIteratee];
    } else if (typeof sortIteratee === 'function') {
      value = sortIteratee(entity);
    }
    return typeof value === 'string' ? value.trim().toLowerCase() : value;
  };

  const sorted = sortBy(entities, caseInsensitiveSortIteratee);
  if (orderDirectionState === 'DESC') {
    reverse(sorted);
  }
  return sorted;
}

export function getHeaderWithCount(totalHits: number, filteredHits: number) {
  if (totalHits === 0) {
    return undefined;
  } else if (totalHits === filteredHits) {
    return `(${totalHits})`;
  } else {
    return `(${filteredHits}/${totalHits})`;
  }
}
