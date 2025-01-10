/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ChangeEvent, ReactElement, useState } from 'react';
import { Add } from '@carbon/icons-react';
import React from 'react';

import {
  CarbonDataTable as DataTable,
  CarbonTable as Table,
  CarbonTableHead as TableHead,
  CarbonTableRow as TableRow,
  CarbonTableHeader as TableHeader,
  CarbonTableBody as TableBody,
  CarbonTableCell as TableCell,
  CarbonTableContainer as TableContainer,
  CarbonTableToolbar as TableToolbar,
  CarbonTableToolbarSearch as TableToolbarSearch,
  CarbonTableToolbarContent as TableToolbarContent,
  CarbonOverflowMenu as OverflowMenu,
  CarbonOverflowMenuItem as OverflowMenuItem,
  CarbonTableSelectAll as TableSelectAll,
  CarbonTableSelectRow as TableSelectRow,
  Pagination,
  TableSkeleton,
  CarbonButton as Button,
  CarbonTableBatchAction as TableBatchAction,
  CarbonTableBatchActions as TableBatchActions,
  CarbonInlineLoading as InlineLoading,
  CarbonIconButton as IconButton,
  Tooltip
} from '@instana/components';
import { Observable } from '@instana/observables';
import { createLogger } from '@instana/logger';
import { t, Trans } from '@instana/i18n-react';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import useUrlState from 'in-hooks/useUrlState';

import locals from './CarbonDataTableWrapper.mless';

interface OverflowMenuItemProps {
  label?: string;
  actionType: string;
  text?: string;
  icon?: JSX.Element;
}
interface BatchActionItemProps {
  renderIcon: React.ElementType<any> | undefined;
  actionName: string;
  actionType: string;
}

export interface DataTableCell<ItemType extends Object> {
  id: string;
  value: ItemType;
  isEditable: boolean;
  isEditing: boolean;
  isValid: boolean;
  errors: null | Array<Error>;
  info: {
    header: string;
  };
}

type DataTableCells<T extends any[]> = { [K in keyof T]: DataTableCell<T[K]> };
export interface DataTableHeader {
  key: string;
  header: React.ReactNode;
  slug?: React.ReactElement;
}

export interface DataTableRow<ColTypes extends any[]> {
  id: string;
  cells: DataTableCells<ColTypes>;
  disabled?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  rowData?: Object | any;
}

export interface TableActions<ItemType extends Object> {
  delete?: {
    deleteEntity: (entity: ItemType) => Observable<any> | undefined;
    batchDeleteEntity?: (entity: string[]) => Observable<any> | undefined;
  };
}

interface CarbonDataTableWrapperProps<ItemType extends Object> {
  title: string;
  tableHeaders: DataTableHeader[];
  tableRows: Array<Omit<DataTableRow<any>, 'cells'>>;
  getMenuItems: (row: DataTableRow<any[]>) => OverflowMenuItemProps[];
  getBatchActionItems?: () => BatchActionItemProps[];
  labelNew: string;
  loading: boolean;
  onCreateNew?: () => void;
  searchPlaceholderText: string;
  initalSortConfig: { key: string; direction: string };
  boundedPath?: string;
  pageSizes: number[];
  enableMultSelect?: boolean;
  customDialogMessage?: (entity: ItemType) => string | ReactElement<any> | undefined;
  customBatchDeleteMessage?: (entities: ItemType[]) => string | ReactElement<any> | undefined;
  customDialogConfirmLabel?: string;
  tableActions: TableActions<ItemType>;
  getEntityName: (element: ItemType) => string;
  searchAttributes?: any;
}

const logger = createLogger('SettingsList');

export default function CarbonDataTableWrapper<ItemType extends Object>(props: CarbonDataTableWrapperProps<ItemType>) {
  const {
    title,
    tableHeaders,
    tableRows,
    loading,
    labelNew,
    onCreateNew,
    searchPlaceholderText,
    getMenuItems,
    getBatchActionItems,
    initalSortConfig,
    boundedPath,
    pageSizes,
    enableMultSelect = true,
    getEntityName,
    tableActions,
    customDialogConfirmLabel,
    customDialogMessage,
    customBatchDeleteMessage,
    searchAttributes
  } = props;

  const [{ query, page }, setState] = useUrlState({
    bind: [
      {
        path: boundedPath ?? '/',
        name: 'query',
        initialState: ''
      },
      {
        path: boundedPath ?? '/',
        name: 'page',
        initialState: 1,
        parser: intParser
      }
    ]
  });
  const [searchQuery, setSearchQuery] = useState(boundedPath && query ? query : '');
  const [sortConfig, setSortConfig] = useState(initalSortConfig);
  const [currentPage, setCurrentPage] = useState(boundedPath && page ? page : 1);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [loadingRow, setLoadingRow] = useState(null);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  const isLoading = loading && tableRows?.length == 0;

  const filteredRows = tableRows.filter(item => {
    return searchAttributes.some((key: string) => {
      const fieldValue = item.rowData[key] ? item.rowData[key].toString().toLowerCase() : '';
      return fieldValue.includes(searchQuery.toLowerCase());
    });
  });
  const sortedRows =
    sortConfig.key && filteredRows?.length > 0
      ? [...filteredRows].sort((a, b) => {
          const aValue = a.rowData[sortConfig.key];
          const bValue = b.rowData[sortConfig.key];
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        })
      : filteredRows;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows = sortedRows?.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    if (boundedPath) {
      setState({ query: searchQuery, page: page });
    }
  };

  const handleChangeSearchString = (searchQuery: string) => {
    setSearchQuery(searchQuery);
    setCurrentPage(1);
    if (boundedPath) {
      setState({ query: searchQuery, page: 1 });
    }
  };

  const handleChangeSort = (key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleDeleteActions = (row: DataTableRow<any>) => {
    const deleteEntity = { ...tableActions.delete };
    const entity = paginatedRows.filter(item => item.id === row.id)[0].rowData;
    return addActiveDialog(
      <ConfirmationDialog
        header={t('in-settings:components.pleaseConfirm')}
        description={
          customDialogMessage ? (
            customDialogMessage(entity)
          ) : (
            <span>
              <Trans i18nKey="in-settings:components.confirmRemoveEntity" values={{ entity: getEntityName(entity) }} />
            </span>
          )
        }
        confirmButtonLabel={customDialogConfirmLabel || t('in-settings:components.removeBtn')}
        onSubmit={() => {
          close();
          const deletion$ = deleteEntity.deleteEntity?.(entity);
          setLoadingRow(entity.id);
          deletion$?.once(() => {
            setLoadingRow(null);
          });
          deletion$?.errors().once((error: Error) => {
            const errorMessage = t('in-settings:components.failedToRemoveItem') + ` (${entity.id}): ${error.message}`;
            logger.error(errorMessage, error);
            addMessage({
              type: 'danger',
              content: errorMessage
            });
            setLoadingRow(null);
          });
        }}
        confirmButtonAutoFocus
      />
    );
  };

  const handleBatchDeleteActions = (selectedRows: DataTableRow<any[]>[]) => {
    const deleteEntity = { ...tableActions.delete };
    const entities = paginatedRows
      .filter(item => selectedRows.some(selectedRow => selectedRow.id === item.id))
      .map(row => row.rowData);
    const selectedIds = entities.map(entity => entity.id);
    return addActiveDialog(
      <ConfirmationDialog
        header={t('in-settings:components.pleaseConfirm')}
        description={
          customBatchDeleteMessage ? (
            customBatchDeleteMessage(entities)
          ) : (
            <span>
              <Trans
                i18nKey="in-settings:components.confirmRemoveEntity"
                values={{
                  entity: t('in-settings:tabs.noOfItemsSelected', { noOfItemsSelected: selectedRows?.length })
                }}
              />
            </span>
          )
        }
        confirmButtonLabel={customDialogConfirmLabel || t('in-settings:components.removeBtn')}
        onSubmit={() => {
          setIsBatchDeleting(true);
          close();
          const deletion$ = deleteEntity.batchDeleteEntity?.(selectedIds);
          deletion$?.once(() => {
            setIsBatchDeleting(false);
          });
          deletion$?.errors().once((error: Error) => {
            setIsBatchDeleting(false);
            const errorMessage =
              t('in-settings:components.failedToRemoveItemName', {
                itemName: t('in-settings:tabs.noOfItemsSelected', { noOfItemsSelected: selectedRows?.length })
              }) + `: ${error.message}`;
            logger.error(errorMessage, error);
            addMessage({
              type: 'danger',
              content: errorMessage
            });
          });
        }}
        confirmButtonAutoFocus
      />
    );
  };
  return (
    <>
      <DataTable rows={paginatedRows} headers={tableHeaders} isSortable>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getToolbarProps,
          getBatchActionProps,
          getTableProps,
          getTableContainerProps,
          getSelectionProps,
          selectRow,
          selectedRows
        }) => {
          const batchActionProps = {
            ...getBatchActionProps({
              onSelectAll: () => {
                rows.map(row => {
                  if (!row.isSelected) {
                    selectRow(row.id);
                  }
                });
              }
            })
          };
          return (
            <TableContainer
              title={defaultHeaderWithCount(title, tableRows.length, filteredRows.length, isLoading)}
              {...getTableContainerProps()}
            >
              {isLoading ? (
                <TableSkeleton showHeader={false} zebra showToolbar={false} />
              ) : (
                <>
                  <TableToolbar {...getToolbarProps()}>
                    <TableBatchActions {...batchActionProps} className={locals.tableBatchAction}>
                      {getBatchActionItems?.()?.map(batchActionItem => (
                        <TableBatchAction
                          key={batchActionItem.actionName}
                          tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                          renderIcon={batchActionItem.renderIcon}
                          disabled={batchActionItem.actionType === 'delete' && isBatchDeleting}
                          onClick={() => {
                            if (batchActionItem.actionType === 'delete') handleBatchDeleteActions(selectedRows);
                          }}
                        >
                          {batchActionItem.actionName}
                        </TableBatchAction>
                      ))}
                    </TableBatchActions>
                    <TableToolbarContent aria-hidden={batchActionProps.shouldShowBatchActions}>
                      <TableToolbarSearch
                        tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                        labelText={searchPlaceholderText}
                        placeholder={searchPlaceholderText}
                        value={searchQuery}
                        defaultExpanded={searchQuery?.length > 0}
                        // @ts-expect-error no corrects typedef for ToolbarSearch
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeSearchString(e.target.value)}
                      />
                      <Button
                        tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                        kind="primary"
                        onClick={onCreateNew}
                        renderIcon={Add}
                      >
                        {labelNew}
                      </Button>
                    </TableToolbarContent>
                  </TableToolbar>
                  <Table {...getTableProps()} aria-label={title}>
                    <TableHead>
                      <TableRow>
                        {enableMultSelect && <TableSelectAll {...(getSelectionProps({} as any) as any)} />}
                        {headers.map(header => (
                          <TableHeader
                            // @ts-expect-error no correct typedef for Table header
                            key={header.key}
                            {...getHeaderProps({ header })}
                            onClick={() => {
                              handleChangeSort(header.key);
                            }}
                          >
                            {header.header}
                          </TableHeader>
                        ))}
                        <TableHeader />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map(row => (
                        <TableRow
                          // @ts-expect-error no correct typedef for TableRow
                          key={row.id}
                          {...getRowProps({
                            row
                          })}
                        >
                          {enableMultSelect && <TableSelectRow {...(getSelectionProps({ row }) as any)} />}
                          {row.cells.map(cell => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                          {getMenuItems(row)?.length > 3 ? (
                            <TableCell className="cds--table-column-menu">
                              <OverflowMenu disabled={row.disabled}>
                                {getMenuItems(row).map((item, index) => (
                                  <OverflowMenuItem
                                    key={index}
                                    onClick={() => {
                                      if (item.actionType === 'delete') handleDeleteActions(row);
                                    }}
                                    itemText={item.text}
                                    data-testid={`${item.actionType}Icon`}
                                  >
                                    {item.text}
                                  </OverflowMenuItem>
                                ))}
                              </OverflowMenu>
                            </TableCell>
                          ) : (
                            <TableCell>
                              {getMenuItems(row).map((item, index) => (
                                <>
                                  {item.actionType === 'delete' && loadingRow === row.id ? (
                                    <InlineLoading className={locals.loadingIcon} />
                                  ) : row.disabled ? (
                                    // as disabled icon button doesn't show the tooltip
                                    <Tooltip content={item.label} delay={500}>
                                      <IconButton label={item.label} disabled={row.disabled} key={index} kind="ghost">
                                        {item.icon}
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <IconButton
                                      disabled={row.disabled}
                                      kind="ghost"
                                      label={item.label}
                                      key={index}
                                      onClick={() => {
                                        if (item.actionType === 'delete') handleDeleteActions(row);
                                      }}
                                      data-testid={`${item.actionType}Icon`}
                                    >
                                      {item.icon}
                                    </IconButton>
                                  )}
                                </>
                              ))}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </TableContainer>
          );
        }}
      </DataTable>
      {!isLoading && (
        <Pagination
          totalItems={filteredRows.length}
          pageSizes={pageSizes}
          page={currentPage}
          pageSize={pageSize}
          onChange={data => handlePageChange(data.page, data.pageSize)}
        />
      )}
    </>
  );
}

export function defaultHeaderWithCount(title: string, totalHits: number, filteredHits: number, isLoading: boolean) {
  if (totalHits === 0 || isLoading) {
    return title;
  } else if (totalHits === filteredHits) {
    return `${title} (${totalHits})`;
  } else {
    return `${title} (${filteredHits}/${totalHits})`;
  }
}
