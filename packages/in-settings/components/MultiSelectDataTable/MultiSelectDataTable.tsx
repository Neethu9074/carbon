/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
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
  Tooltip,
  CarbonEmptyState,
  CarbonToastNotification as ToastNotification
} from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { Observable } from '@instana/observables';
import { createLogger } from '@instana/logger';
import { t, Trans } from '@instana/i18n-react';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import useUrlState from 'in-hooks/useUrlState';

import locals from './MultiSelectDataTable.mless';

export interface Notification {
  readonly key?: string;
  readonly kind: 'error' | 'info' | 'success' | 'warning';
  readonly title: string;
  readonly subtitle?: string;
  readonly caption?: string;
  readonly timeout?: number;
}

export interface OverflowMenuItemProps {
  label?: string;
  actionType: string;
  text?: string;
  icon?: JSX.Element;
}

export interface BatchActionItemProps {
  renderIcon: React.ElementType<any> | undefined;
  actionName: string;
  actionType: string;
}

export interface DataTableCell<ITEM_TYPE extends Object> {
  id: string;
  value: ITEM_TYPE;
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

export interface DataTableRow<COL_TYPE extends any[], ROW_DATA_TYPE extends Record<string, any>> {
  id: string;
  cells: DataTableCells<COL_TYPE>;
  disabled?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  rowData: ROW_DATA_TYPE;
}

export interface TableActions<ITEM_TYPE extends Object> {
  delete?: {
    deleteEntity: (entity: ITEM_TYPE) => Observable<any> | undefined;
    batchDeleteEntity?: (entity: string[]) => Observable<any> | undefined;
  };
}

type TableRows<ROW_OBJECT_TYPE extends Object, ROW_DATA_TYPE extends Object> = Omit<
  DataTableRow<any[], ROW_DATA_TYPE>,
  'cells'
> &
  ROW_OBJECT_TYPE;

interface MultiSelectDataTableProps<
  ROW_OBJECT_TYPE extends Object,
  ROW_DATA_TYPE extends Record<string, any>,
  COL_TYPE extends any[]
> {
  title: string;
  tableHeaders: Readonly<DataTableHeader[]>;
  tableRows: Array<TableRows<ROW_OBJECT_TYPE, ROW_DATA_TYPE>>;
  getMenuItems: (row: Omit<DataTableRow<COL_TYPE, ROW_DATA_TYPE>, 'rowData'>) => Readonly<OverflowMenuItemProps[]>;
  getBatchActionItems?: () => Readonly<BatchActionItemProps[]>;
  labelNew: string;
  loading: boolean;
  onCreateNew?: () => void;
  onRowSelect?: (selectedRows: string[]) => void;
  searchPlaceholderText: string;
  initalSortConfig: Readonly<{ key: string; direction: string }>;
  boundedPath?: string;
  pageSizes: Readonly<number[]>;
  enableMultSelect?: boolean;
  customDialogMessage?: (entity: ROW_DATA_TYPE) => string | ReactElement<any> | undefined;
  customBatchDeleteMessage?: (entities: ROW_DATA_TYPE[]) => string | ReactElement<any> | undefined;
  customDialogConfirmLabel?: string;
  tableActions: Readonly<TableActions<ROW_DATA_TYPE>>;
  getEntityName: (element: ROW_DATA_TYPE) => string;
  message?: Notification | null;
  searchAttributes: Array<keyof ROW_DATA_TYPE>;
}

const logger = createLogger('SettingsList');

export default function MultiSelectDataTable<
  ROW_OBJECT_TYPE extends Object,
  ROW_DATA_TYPE extends Record<string, any>,
  COL_TYPE extends any[]
>(props: MultiSelectDataTableProps<ROW_OBJECT_TYPE, ROW_DATA_TYPE, COL_TYPE>) {
  const {
    title,
    tableHeaders,
    tableRows,
    loading,
    labelNew,
    onCreateNew,
    onRowSelect,
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
    searchAttributes,
    message
  } = props;

  if (!searchAttributes.length) throw new Error('At least one search attribute must be defined.');

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
  const [notification, setNotification] = useState<Notification>();
  const isLoading = loading && tableRows?.length == 0;
  const isEmptyState = !loading && tableRows?.length == 0;

  const filteredRows = tableRows.filter(item => {
    return searchAttributes.some(key => {
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

  useEffect(() => {
    if (message) {
      setNotification({ key: generateUniqueShortId(), ...message });
    }
  }, [message]);

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

  const handleDeleteActions = (row: DataTableRow<COL_TYPE, ROW_DATA_TYPE>) => {
    const deleteEntity = { ...tableActions.delete };
    const entity = paginatedRows.filter(item => item.id === row.id)[0].rowData;
    return addActiveDialog(
      <ConfirmationDialog
        header={t('in-settings:components.confirmRemove')}
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
            setNotification({
              key: generateUniqueShortId(),
              kind: 'success',
              title: t('in-settings:components.removedEntity', {
                entity: getEntityName(entity)
              }),
              timeout: 10000
            });
          });
          deletion$?.errors().once((error: Error) => {
            logger.error(error.message, error);
            setNotification({
              key: generateUniqueShortId(),
              kind: 'error',
              title: t('in-settings:components.failedToRemoveItem'),
              subtitle: `(${entity.id}): ${error.message}`
            });
            setLoadingRow(null);
          });
        }}
        confirmButtonAutoFocus
      />
    );
  };

  const handleBatchDeleteActions = (selectedRows: DataTableRow<COL_TYPE, ROW_DATA_TYPE>[]) => {
    const deleteEntity = { ...tableActions.delete };
    const entities = paginatedRows
      .filter(item => selectedRows.some(selectedRow => selectedRow.id === item.id))
      .map(row => row.rowData);
    const selectedIds = entities.map(entity => entity.id);
    return addActiveDialog(
      <ConfirmationDialog
        header={t('in-settings:components.confirmRemove')}
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
            setNotification({
              kind: 'success',
              title: t('in-settings:components.removedEntity', {
                entity: t('in-settings:tabs.noOfItemsSelected', { noOfItemsSelected: selectedRows?.length })
              }),
              timeout: 10000
            });
          });
          deletion$?.errors().once((error: Error) => {
            setIsBatchDeleting(false);
            logger.error(error.message, error);
            setNotification({
              kind: 'error',
              title: t('in-settings:components.failedToRemoveItemName', {
                itemName: t('in-settings:tabs.noOfItemsSelected', { noOfItemsSelected: selectedRows?.length })
              }),
              subtitle: error.message,
              timeout: 10000
            });
          });
        }}
        confirmButtonAutoFocus
      />
    );
  };

  return (
    <>
      {notification && notification?.title && (
        <ToastNotification
          key={notification?.key}
          kind={notification.kind}
          title={notification.title}
          subtitle={notification.subtitle}
          lowContrast
          timeout={notification.timeout}
          className={locals.toastMessage}
          caption={notification.caption}
        />
      )}
      <DataTable rows={paginatedRows} headers={[...tableHeaders]} isSortable>
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

                if (onRowSelect) {
                  // Row is not yet selected therefore isSelected is still false
                  const selectedIds = rows.filter(row => !row.isSelected).map(row => row.id);
                  onRowSelect(selectedIds);
                }
              }
            })
          };

          return (
            <TableContainer
              title={defaultHeaderWithCount(title, tableRows.length, filteredRows.length, isLoading)}
              {...getTableContainerProps()}
            >
              {isLoading ? (
                <TableSkeleton showHeader={false} zebra showToolbar={false} columnCount={tableHeaders.length} />
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
                            if (batchActionItem.actionType === 'delete')
                              handleBatchDeleteActions(selectedRows as DataTableRow<COL_TYPE, ROW_DATA_TYPE>[]);
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
                      {onCreateNew && (
                        <Button
                          tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                          kind="primary"
                          onClick={onCreateNew}
                          renderIcon={Add}
                        >
                          {labelNew}
                        </Button>
                      )}
                    </TableToolbarContent>
                  </TableToolbar>
                  <Table {...getTableProps()} aria-label={title}>
                    <TableHead>
                      <TableRow>
                        {enableMultSelect && !isEmptyState && (
                          <TableSelectAll
                            {...(getSelectionProps({
                              rows,
                              onClick: () => {
                                if (onRowSelect) {
                                  // Row is not yet selected therefore isSelected is still false
                                  const selectedIds = rows.filter(row => !row.isSelected).map(row => row.id);
                                  onRowSelect(selectedIds);
                                }
                              }
                            } as any) as any)}
                          />
                        )}
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
                    {isEmptyState && (
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={tableHeaders.length}>
                            <CarbonEmptyState
                              icon="lib_carbon_empty_state"
                              title={message?.kind === 'error' ? t('in-settings:components.errorTitle') : ''}
                              text={t('in-settings:components.noDataAvailable')}
                              className={locals.emptyState}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                    {!isEmptyState && (
                      <TableBody>
                        {rows.map(row => (
                          <TableRow
                            // @ts-expect-error no correct typedef for TableRow
                            key={`table-row-${row.id}`}
                            {...getRowProps({
                              row
                            })}
                          >
                            {enableMultSelect && (
                              <TableSelectRow
                                {...(getSelectionProps({
                                  row,
                                  onChange: () => {
                                    if (onRowSelect) {
                                      let selectedIds = selectedRows.map(row => row.id);
                                      if (row.isSelected) {
                                        // row was previously selected
                                        selectedIds = selectedIds.filter(id => id !== row.id);
                                      } else {
                                        // row has been selected
                                        selectedIds.push(row.id);
                                      }
                                      onRowSelect(selectedIds);
                                    }
                                  }
                                }) as any)}
                              />
                            )}
                            {row.cells.map(cell => (
                              <TableCell key={`table-cell-${cell.id}`}>{cell.value}</TableCell>
                            ))}
                            {getMenuItems(row as Omit<DataTableRow<COL_TYPE, ROW_DATA_TYPE>, 'rowData'>)?.length > 3 ? (
                              <TableCell className="cds--table-column-menu">
                                <OverflowMenu disabled={row.disabled}>
                                  {getMenuItems(row as Omit<DataTableRow<COL_TYPE, ROW_DATA_TYPE>, 'rowData'>).map(
                                    (item, index) => (
                                      <OverflowMenuItem
                                        key={index}
                                        onClick={() => {
                                          if (item.actionType === 'delete')
                                            handleDeleteActions(row as DataTableRow<COL_TYPE, ROW_DATA_TYPE>);
                                        }}
                                        itemText={item.text}
                                        data-testid={`${item.actionType}Icon`}
                                      >
                                        {item.text}
                                      </OverflowMenuItem>
                                    )
                                  )}
                                </OverflowMenu>
                              </TableCell>
                            ) : (
                              <TableCell>
                                {getMenuItems(row as Omit<DataTableRow<COL_TYPE, ROW_DATA_TYPE>, 'rowData'>).map(
                                  (item, index) => (
                                    <span key={`table-menu-${row.id}-${index}`}>
                                      {item.actionType === 'delete' && loadingRow === row.id ? (
                                        <InlineLoading className={locals.loadingIcon} />
                                      ) : row.disabled ? (
                                        // as disabled icon button doesn't show the tooltip
                                        <Tooltip content={item.label} delay={500}>
                                          <IconButton
                                            label={item.label}
                                            disabled={row.disabled}
                                            key={index}
                                            kind="ghost"
                                          >
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
                                            if (item.actionType === 'delete')
                                              handleDeleteActions(row as DataTableRow<COL_TYPE, ROW_DATA_TYPE>);
                                          }}
                                          data-testid={`${item.actionType}Icon`}
                                          autoAlign
                                        >
                                          {item.icon}
                                        </IconButton>
                                      )}
                                    </span>
                                  )
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    )}
                  </Table>
                </>
              )}
            </TableContainer>
          );
        }}
      </DataTable>
      {tableRows?.length > 0 && (
        <Pagination
          totalItems={filteredRows.length}
          pageSizes={[...pageSizes]}
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
