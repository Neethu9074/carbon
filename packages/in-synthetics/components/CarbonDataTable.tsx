/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ChangeEvent, Fragment, ReactNode, useCallback, useMemo, useState } from 'react';
import { Filter, Close } from '@carbon/icons-react';
import classNames from 'classnames';

import {
  Button,
  DataTable,
  IconButton,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch
} from '@instana/carbon';
import { ErrorEmptyState, NoDataEmptyState } from '@instana/ibm-products';
import { TableSkeleton } from '@instana/components';

import {
  CarbonHeader,
  ListItem,
  CarbonDataTableProps,
  BatchActionItemProps,
  SelectionProps,
  Row,
  Cell
} from 'in-synthetics/components/constants';
import useFilterPanelAnimation from 'in-synthetics/components/hooks/useFilterPanelAnimation';
import FilterPanel from 'in-service-levels/components/SloList/components/FilterPanel';
import { getNextSortDirection } from 'in-synthetics/components/utils';
import { TrProps } from 'in-components/tables/ServerTable/types';
import { hasError } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from 'in-synthetics/components/CarbonDataTable.mless';

/**
 * TableRowComponent - Renders a standard non-expandable table row
 *
 * This component handles the rendering of regular table rows, including:
 * - Selection checkbox (when table is selectable)
 * - Cell content with proper styling based on header configuration
 * - Support for custom cell styling (width, wrapping, ellipsis)
 */
const TableRowComponent = <ITEM_TYPE extends ListItem>({
  row,
  headers,
  isSelectable,
  getRowProps,
  getSelectionProps
}: {
  row: Row;
  headers: CarbonHeader<ITEM_TYPE>[];
  isSelectable: boolean;
  getRowProps: (props: { row: Row }) => TrProps;
  getSelectionProps: (props: { row: Row }) => SelectionProps;
}) => (
  <TableRow {...getRowProps({ row })}>
    {isSelectable && <TableSelectRow {...getSelectionProps({ row })} />}
    {row.cells.map((cell: Cell, i: number) => {
      const header = headers[i];
      return (
        <TableCell
          key={cell.id}
          style={header.width && !header.useMinimumAmountOfHorizontalSpace ? { maxWidth: header.width } : {}}
          className={classNames({
            [locals[`rowWidth.w-${header.width}`]]: header.width && !header.useMinimumAmountOfHorizontalSpace,
            [locals.noWrap]: header.noWrap,
            [locals.ellipsis]: header.ellipsis,
            [locals.tableMinimumHorizontalSpace]: header.useMinimumAmountOfHorizontalSpace
          })}
        >
          {cell.value}
        </TableCell>
      );
    })}
  </TableRow>
);

/**
 * ExpandableRowComponent - Renders an expandable table row with its expanded content
 *
 * This component handles:
 * - Expandable row rendering with expand/collapse functionality
 * - Selection checkbox integration (when table is selectable)
 * - Expanded content rendering when row is expanded
 * - Proper event handling for expansion toggling
 */
const ExpandableRowComponent = <ITEM_TYPE extends ListItem>({
  row,
  isExpanded,
  toggleRowExpansion,
  isSelectable,
  headers,
  getExpandedRowProps,
  getSelectionProps,
  rowIdToExpanded
}: {
  row: Row;
  isExpanded: boolean;
  toggleRowExpansion: (rowId: string) => void;
  isSelectable: boolean;
  headers: CarbonHeader<ITEM_TYPE>[];
  getExpandedRowProps: (props: { row: Row }) => {
    id: string;
  };
  getSelectionProps: (props: { row: Row }) => SelectionProps;
  rowIdToExpanded: Record<string, ReactNode>;
}) => (
  <Fragment key={row.id}>
    <TableExpandRow
      aria-label="Row expander"
      {...getExpandedRowProps({ row })}
      isExpanded={isExpanded}
      onExpand={() => toggleRowExpansion(row.id)}
    >
      {isSelectable && <TableSelectRow {...getSelectionProps({ row })} />}
      {row.cells.map((cell: Cell, i: number) => {
        const header = headers[i];
        return (
          <TableCell
            key={cell.id}
            style={header.width && !header.useMinimumAmountOfHorizontalSpace ? { maxWidth: header.width } : {}}
            className={classNames({
              [locals[`rowWidth.w-${header.width}`]]: header.width && !header.useMinimumAmountOfHorizontalSpace,
              [locals.noWrap]: header.noWrap,
              [locals.ellipsis]: header.ellipsis,
              [locals.tableMinimumHorizontalSpace]: header.useMinimumAmountOfHorizontalSpace
            })}
          >
            {cell.value}
          </TableCell>
        );
      })}
    </TableExpandRow>
    {isExpanded && <TableExpandedRow colSpan={headers.length + 2}>{rowIdToExpanded[row.id] ?? ''}</TableExpandedRow>}
  </Fragment>
);

/**
 * CarbonDataTable - A feature-rich data table component with Carbon Design System styling
 *
 * Features:
 * - Sortable columns
 * - Expandable rows
 * - Row selection with batch actions
 * - Search functionality
 * - Filtering capabilities
 * - Loading states
 * - Empty and error states
 * - Configurable columns
 * - Custom toolbar content
 */
export const CarbonDataTable = React.memo(
  <ITEM_TYPE extends ListItem>({
    rows,
    headers,
    query = '',
    isLoading = false,
    isSearchable = false,
    isExpandable = false,
    isSelectable = false,
    fixedLayout = false,
    toolBarContent,
    configureColumnContent,
    actionButtonContent,
    result,
    searchText = t('in-synthetics:components.dataTable.searchText'),
    noDataHeader = t('in-synthetics:components.dataTable.noDataHeader'),
    noDataDescription = t('in-synthetics:components.dataTable.noDataDescription'),
    errorHeader = t('in-synthetics:components.dataTable.errorHeader'),
    page,
    isFilterable,
    filters,
    onFilterApply,
    onFilterCancel,
    getBatchActionItems,
    searchRows,
    sortRow
  }: CarbonDataTableProps<ITEM_TYPE>) => {
    // Determine if toolbar should be shown based on features enabled
    const showToolbar =
      useMemo(
        () => isSearchable || toolBarContent || actionButtonContent || isSelectable,
        [isSearchable, toolBarContent, actionButtonContent, isSelectable]
      ) || isFilterable;

    // Track expanded row IDs for expandable rows
    const [expandedRowIds, setExpandedRowIds] = useState(new Set());

    // Hook for filter panel animation
    const { tableContainerRef, animatePanel } = useFilterPanelAnimation({ page, result });

    // Track filter panel open state
    const [popoverOpen, setPopoverOpen] = useState(false);

    /**
     * Create a mapping of row IDs to their expanded content
     * This allows us to efficiently retrieve expanded content when a row is expanded
     */
    const rowIdToExpanded = useMemo(() => {
      const map: Record<string, ReactNode> = {};
      rows.forEach(row => {
        if (row.expanded) {
          map[row.id] = row.expanded;
        }
      });
      return map;
    }, [rows]);

    /**
     * Handle header click for sorting
     * Updates sort direction and applies sorting via the provided sortRow callback
     */
    const handleHeaderClick = useCallback(
      (
        header: CarbonHeader<ITEM_TYPE>,
        headers: CarbonHeader<ITEM_TYPE>[],
        sortRow?: (sortState: { sortDirection: string; sortHeaderKey: string }) => void
      ) => {
        sortRow?.({ sortHeaderKey: header.key, sortDirection: header.sortDirection! });
        const nextDirection = getNextSortDirection(header.key, header.key, header.sortDirection!);
        headers.forEach(o => (o.sortDirection = 'NONE'));
        header.sortDirection = nextDirection;
      },
      []
    );

    /**
     * Toggle row expansion state
     * Adds or removes the row ID from the set of expanded row IDs
     */
    const toggleRowExpansion = useCallback((rowId: string) => {
      setExpandedRowIds(prev => {
        const newIds = new Set(prev);
        if (newIds.has(rowId)) {
          newIds.delete(rowId);
        } else {
          newIds.add(rowId);
        }
        return newIds;
      });
    }, []);

    /**
     * Handle batch action click
     * Collects selected row IDs and passes them to the batch action handler
     */
    const handleBatchActionClick = (batchActionItem: BatchActionItemProps, rows: Row[]) => {
      const selectedIds = rows.filter(row => row.isSelected).map(row => row.id);
      batchActionItem.onClick(selectedIds);
    };

    const handleFilterClose = () => {
      onFilterCancel?.();
      setPopoverOpen(false);
      animatePanel(popoverOpen);
    };

    const handleFilterApply = () => {
      onFilterApply?.();
      setPopoverOpen(false);
      animatePanel(popoverOpen);
    };

    return (
      <DataTable rows={rows} headers={headers}>
        {({
          rows,
          headers,
          getTableContainerProps,
          getToolbarProps,
          getHeaderProps,
          getTableProps,
          onInputChange,
          getRowProps,
          getSelectionProps,
          getBatchActionProps,
          getExpandHeaderProps,
          getExpandedRowProps
        }) => (
          <div ref={tableContainerRef}>
            <TableContainer {...getTableContainerProps()}>
              <>
                {/* Toolbar section with search, filters, and actions */}
                {showToolbar && (
                  <TableToolbar {...getToolbarProps()}>
                    {/* Batch actions section - shown when rows are selected */}
                    <TableBatchActions {...getBatchActionProps()} className={locals.tableBatchAction}>
                      {getBatchActionItems?.()?.map(batchActionItem => (
                        <TableBatchAction
                          key={batchActionItem.actionName}
                          renderIcon={batchActionItem.renderIcon}
                          tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                          onClick={() => handleBatchActionClick(batchActionItem, rows)}
                        >
                          {batchActionItem.actionName}
                        </TableBatchAction>
                      ))}
                    </TableBatchActions>

                    {/* Main toolbar content - search, filters, and custom actions */}
                    <TableToolbarContent aria-hidden={getBatchActionProps().shouldShowBatchActions}>
                      {/* Filter button - toggles filter panel */}
                      {isFilterable && (
                        <IconButton
                          disabled={isLoading || result.errors.length > 0 || !filters}
                          onClick={() => {
                            setPopoverOpen(prev => !prev);
                            animatePanel(popoverOpen);
                          }}
                          label={t('in-synthetics:components.dataTable.filterPanel.title')}
                          kind="ghost"
                          autoAlign
                          align="right"
                        >
                          <Filter />
                        </IconButton>
                      )}

                      {/* Search input */}
                      {isSearchable && (
                        <TableToolbarSearch
                          persistent
                          className={locals.searchBox}
                          defaultValue={query}
                          onChange={e => (searchRows ? searchRows(e as ChangeEvent<HTMLInputElement>) : onInputChange)}
                          placeholder={searchText}
                        />
                      )}

                      {/* Custom toolbar content slots */}
                      {toolBarContent ?? null}
                      {configureColumnContent ?? null}
                      {actionButtonContent ?? null}
                    </TableToolbarContent>
                  </TableToolbar>
                )}

                {/* Filter panel - shown when filter button is clicked */}
                <FilterPanel
                  popoverOpen={popoverOpen}
                  closeButton={
                    <IconButton
                      wrapperClasses={locals.filterCloseWrapper}
                      kind="ghost"
                      className={locals.filterCloseButton}
                      label={t('in-synthetics:components.dataTable.filterPanel.closeButtonLabel')}
                      align="left"
                      onClick={handleFilterClose}
                    >
                      <Close />
                    </IconButton>
                  }
                  filters={filters}
                  secondaryButton={
                    <Button kind="secondary" onClick={handleFilterClose}>
                      {t('in-synthetics:components.dataTable.filterPanel.cancelButtonLabel')}
                    </Button>
                  }
                  primaryButton={
                    <Button kind="primary" onClick={handleFilterApply}>
                      {t('in-synthetics:components.dataTable.filterPanel.applyButtonLabel')}
                    </Button>
                  }
                />

                {/* Loading state - shows skeleton while data is loading */}
                {isLoading ? (
                  <TableSkeleton showHeader={false} zebra showToolbar={false} columnCount={headers.length} />
                ) : (
                  <Table
                    {...getTableProps()}
                    className={classNames({
                      [locals.fixedLayout]: fixedLayout
                    })}
                  >
                    {/* Table header section */}
                    <TableHead>
                      <TableRow>
                        {/* Select all checkbox - shown when table is selectable and has rows */}
                        {isSelectable && rows.length !== 0 && <TableSelectAll {...getSelectionProps()} />}

                        {/* Expand header - shown when table has expandable rows */}
                        {isExpandable && <TableExpandHeader {...getExpandHeaderProps()} />}

                        {/* Column headers with sorting capability */}
                        {headers.map((header: CarbonHeader<ITEM_TYPE>) => {
                          const isSortable = header?.isSortable;
                          const style = !isSortable
                            ? { width: header.widthInAbsoluteUnit ? header.width : header.width + '%' }
                            : {};

                          return (
                            <TableHeader
                              {...getHeaderProps({
                                header,
                                isSortable,
                                style
                              })}
                              isSortHeader={isSortable}
                              sortDirection={header?.sortDirection ?? 'NONE'}
                              onClick={() => handleHeaderClick(header, headers as CarbonHeader<ITEM_TYPE>[], sortRow)}
                              key={header?.key}
                              className={isSortable && header.width ? locals['columnWidth-' + header.width] : ''}
                            >
                              {header.header}
                            </TableHeader>
                          );
                        })}
                      </TableRow>
                    </TableHead>

                    {/* Table body section */}
                    <TableBody>
                      {/* Render expandable rows when isExpandable is true */}
                      {isExpandable &&
                        rows.map(row => {
                          const isExpanded = expandedRowIds.has(row.id);
                          return (
                            <ExpandableRowComponent
                              key={row.id}
                              row={row}
                              isExpanded={isExpanded}
                              toggleRowExpansion={toggleRowExpansion}
                              isSelectable={isSelectable}
                              headers={headers as CarbonHeader<ITEM_TYPE>[]}
                              getExpandedRowProps={props => getExpandedRowProps(props)}
                              getSelectionProps={getSelectionProps}
                              rowIdToExpanded={rowIdToExpanded}
                            />
                          );
                        })}

                      {/* Render standard rows when isExpandable is false */}
                      {!isExpandable &&
                        rows.map(row => (
                          <TableRowComponent
                            key={row.id}
                            row={row}
                            headers={headers as CarbonHeader<ITEM_TYPE>[]}
                            isSelectable={isSelectable}
                            getRowProps={getRowProps}
                            getSelectionProps={getSelectionProps}
                          />
                        ))}

                      {/* Empty state handling - shows when no rows are present */}
                      {rows.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isExpandable ? headers.length + 1 : headers.length}>
                            {/* Show error state if there are errors in the result */}
                            {hasError(result) ? (
                              <ErrorEmptyState
                                title={errorHeader}
                                subtitle={result?.errors[0].message}
                                className={locals.noDataTile}
                              />
                            ) : (
                              /* Show no data state if there are no errors but no data */
                              <NoDataEmptyState
                                title={noDataHeader}
                                subtitle={noDataDescription}
                                className={locals.noDataTile}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </>
            </TableContainer>
          </div>
        )}
      </DataTable>
    );
  }
);
