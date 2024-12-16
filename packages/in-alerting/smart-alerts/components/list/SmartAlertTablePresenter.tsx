/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';
import { debounce } from 'lodash';

import {
  NoDataTile,
  Pagination,
  Stack,
  CarbonTableBatchActions,
  DataTable,
  CarbonTableBatchAction,
  CarbonTableToolbar,
  CarbonTableToolbarSearch
} from '@instana/components';
import { TableErrorRows } from '@instana/legacy';

import { TableProps, ColumnDefinition, TableState } from 'in-components/tables/ServerTable/types';
import { RowProps } from 'in-alerting/smart-alerts/components/list/SmartAlertsTableView';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { OrderDirection, PaginatedResult, Result } from 'in-types';
import { hasError } from 'in-services/util/result';
import { t } from 'in-i18n';

interface CarbonHeader<ITEM_TYPE extends Object> {
  key: string;
  header: string | ReactNode;
  isSortable?: boolean;
  getContent: ColumnDefinition<ITEM_TYPE>['getContent'];
  sortDirection?: OrderDirection | 'NONE';
}

type CarbonHeaders<ITEM_TYPE extends Object> = Array<CarbonHeader<ITEM_TYPE>>;

export interface ListItem extends Object {
  id?: string;
}

export interface ServerTablePresenterProps<ItemType extends ListItem> extends TableProps<ItemType> {
  query?: string;
  page: number;
  pageSize: number;
  pageSizes?: Array<number>;
  result: Result<PaginatedResult<ItemType>>;
  isSearchable?: boolean;
  isSelectable?: boolean;
  toolBarContent?: JSX.Element;
  allRowSelected?: boolean;
  rowSelected?: string[];
  handleSelectAll?: VoidFunction;
  handleRowSelect?: (row: RowProps) => void;
  handleToolBarActionCancel?: VoidFunction;
  noDataHeader?: string;
  noDataDescription?: string | JSX.Element;
  searchPlaceholderText?: string;
}
interface CarbonRow {
  id: string;
  [key: string]: string | JSX.Element;
}

interface SortStateProps {
  sortHeaderKey: string;
  sortDirection: string;
}

type CarbonRows = Array<CarbonRow>;

export default function SmartAlertTablePresenter<
  ItemType extends ListItem,
  PropsType extends ServerTablePresenterProps<ItemType>
>({
  cardTitle,
  columnDefinitions,
  result,
  onChange,
  isSearchable,
  orderBy,
  orderDirection,
  pageSize,
  page,
  pageSizes,
  query,
  isSelectable,
  toolBarContent,
  allRowSelected,
  rowSelected,
  handleSelectAll,
  handleRowSelect,
  handleToolBarActionCancel,
  noDataHeader,
  noDataDescription,
  searchPlaceholderText
}: PropsType) {
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

  const carbonHeaders: CarbonHeaders<ItemType> = columnDefinitions.map(item => ({
    key: item?.id,
    header: item?.label || '',
    isSortable: item?.sortable ?? true,
    getContent: item?.getContent,
    sortDirection: item?.id === orderBy ? (orderDirection === 'ASC' ? 'ASC' : 'DESC') : 'NONE',
    ellipsis: getEllipsisValue(item.ellipsis, item.width),
    width: getWidthValue(item.ellipsis, item.width)
  }));

  const carbonRows: CarbonRows =
    result?.data?.items.map((item: ItemType, index: number) => {
      const rowId = { id: item.id ?? String(index) };

      // Using reduce to directly build the object
      const carbonRow = carbonHeaders.reduce((acc: any, header: any) => {
        acc[header.key] = header.getContent(item);
        return acc;
      }, rowId); // Start with rowId to include 'id' key

      return carbonRow;
    }) || [];

  const debounceOnChange = debounce((searchInput?: string) => {
    if (searchInput !== undefined) {
      onChange?.({ query: searchInput, orderBy, orderDirection, page: 1, pageSize, pageSizes });
    }
  }, 500);

  const filterRows = (searchInputText?: string) => {
    debounceOnChange(searchInputText);
  };

  const isRowSelected = rowSelected?.length ? true : false;
  const displayCarbonToolbar = isSearchable || isRowSelected;
  return (
    <Stack gap="small">
      {/* Table Title */}
      {cardTitle && <AlertTypography variant="heading-03" content={cardTitle} />}
      <span>
        {/* Carbon table toolbar */}
        {displayCarbonToolbar && (
          <CarbonTableToolbar>
            {/* Carbon table search bar and Create SA button */}
            {isSearchable && !isRowSelected ? (
              <>
                <CarbonTableToolbarSearch
                  defaultExpanded
                  expanded
                  defaultValue={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement> | '') => filterRows(e ? e?.target?.value : query)}
                  labelText={searchPlaceholderText}
                  placeholder={searchPlaceholderText}
                />
                {toolBarContent}
              </>
            ) : (
              // Carbon table batch actions, such as Pause, Delete, and Cancel, will only be displayed if the row is selected.
              <CarbonTableBatchActions
                onCancel={() => handleToolBarActionCancel?.()}
                totalSelected={rowSelected?.length || 0}
                shouldShowBatchActions={isRowSelected}
              >
                <CarbonTableBatchAction onClick={() => null} renderIcon="i">
                  {t('in-alerting:table.pause')}
                </CarbonTableBatchAction>
                <CarbonTableBatchAction onClick={() => null} renderIcon="i">
                  {t('in-alerting:table.delete')}
                </CarbonTableBatchAction>
              </CarbonTableBatchActions>
            )}
          </CarbonTableToolbar>
        )}

        {/* Carbon Table */}
        <DataTable
          headers={carbonHeaders}
          rows={carbonRows}
          filterRows={(value: React.ChangeEvent<HTMLInputElement>) => {
            filterRows(value?.target?.value);
          }}
          sortRow={(sortState: SortStateProps) => sortRow(sortState, pageSize, pageSizes, onChange, query)}
          allRowSelected={allRowSelected}
          isSearchEnabled={false}
          isSelectable={isSelectable}
          rowSelected={rowSelected}
          onSelectAllRows={() => handleSelectAll?.()}
          onSelectRow={row => handleRowSelect?.(row)}
          toolBarContent={undefined}
        />
      </span>
      {/* Table Pagination */}
      {result?.data && result.data.totalHits > pageSize ? (
        <Pagination
          currentPage={page}
          totalItems={result?.data?.totalHits}
          pageSize={pageSize}
          pageSizes={pageSizes ?? [pageSize]}
          onChange={data => {
            onChange?.({ query, orderBy, orderDirection, page: data.page, pageSize: data.pageSize, pageSizes });
          }}
        />
      ) : null}

      {/* Empty Content */}
      {carbonRows.length === 0 && <NoDataTile header={noDataHeader} description={noDataDescription} />}

      {/* Error */}
      {hasError(result) && <TableErrorRows cols={columnDefinitions.length} errors={result.errors} size="regular" />}
    </Stack>
  );
}

function sortRow(
  sortState: SortStateProps,
  pageSize: number,
  pageSizes?: Array<number>,
  onChange?: (data: Partial<TableState>) => void,
  query?: string
) {
  let orderBy = sortState.sortHeaderKey;
  let orderDirection = sortState.sortDirection as OrderDirection;
  if (sortState.sortDirection === 'NONE' || sortState.sortDirection === 'ASC') {
    orderDirection = 'DESC';
  } else if (sortState.sortDirection === 'DESC') {
    orderDirection = 'ASC';
  }
  onChange?.({ query, orderBy, orderDirection, page: 1, pageSize, pageSizes });
}
