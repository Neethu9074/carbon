/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { flexRender, createColumnHelper } from '@tanstack/react-table';
import { Filter, Close, Add } from '@carbon/icons-react';
import React, { useMemo } from 'react';
import cx from 'classnames';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbarSearch,
  TableToolbar,
  TableToolbarContent,
  Button,
  IconButton
} from '@instana/carbon';
import { ErrorEmptyState, NoDataEmptyState } from '@instana/ibm-products';
import { Pagination, TableSkeleton } from '@instana/components';
import { generateStableHash } from '@instana/utils';

import useSloListFilter, {
  mapColumnFiltersToUrlState
} from 'in-service-levels/components/SloList/hooks/useSloListFilter';
import SloErrorBudgetColumnContent from 'in-service-levels/components/SloList/components/SloErrorBudgetColumnContent';
import SloBlueprintColumnContent from 'in-service-levels/components/SloList/components/SloBlueprintColumnContent';
import useSloFilterPanelAnimation from 'in-service-levels/components/SloList/hooks/useSloFilterPanelAnimation';
import SloEntityColumnContent from 'in-service-levels/components/SloList/components/SloEntityColumnContent';
import SloStatusColumnContent from 'in-service-levels/components/SloList/components/SloStatusColumnContent';
import SloNameColumnContent from 'in-service-levels/components/SloList/components/SloNameColumnContent';
import SloTagsColumnContent from 'in-service-levels/components/SloList/components/SloTagsColumnContent';
import ConfigureSloDialog from 'in-service-levels/components/ConfigDialog/ConfigureSloDialog';
import SloListFilters from 'in-service-levels/components/SloList/components/SloListFilters';
import useSloListTable from 'in-service-levels/components/SloList/hooks/useSloListTable';
import useSloListFilterUrlState from 'in-service-levels/hooks/useSloListFilterUrlState';
import FilterPanel from 'in-service-levels/components/SloList/components/FilterPanel';
import SloActions from 'in-service-levels/components/SloList/components/SloActions';
import TagFilters from 'in-service-levels/components/SloList/components/TagFilters';
import useDeboucedSearch from 'in-service-levels/hooks/useDebouncedSearch';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { productAreas } from 'in-services/tracking/productAreas';
import useSloTags from 'in-service-levels/hooks/useSloTags';
import { pageNames } from 'in-services/tracking/pageNames';
import { SloListItem } from 'in-service-levels/types';
import useMediaQuery from 'in-hooks/useMediaQuery';
import { all } from 'in-hooks/utils/progress';
import { t } from 'in-i18n';

import locals from './SloList.mless';

interface GetColumnDefinitionsProps {
  isMediumWidth?: boolean;
  isSmallWidth?: boolean;
  showEntityInfo?: boolean;
}

export function getColumnDefinitions({ isMediumWidth, isSmallWidth, showEntityInfo }: GetColumnDefinitionsProps) {
  const columnHelper = createColumnHelper<SloListItem>();
  const columns = [
    columnHelper.accessor(row => row.configuration.name, {
      id: 'name',
      cell: props => <SloNameColumnContent isLink item={props.row.original} />,
      header: t('in-service-levels:sloList.columnLabels.name'),
      enableSorting: true,
      size: 22
    }),
    columnHelper.accessor(row => row.configuration.entity.type, {
      id: 'entityName',
      header: t('in-service-levels:sloList.columnLabels.entity'),
      cell: props => <SloEntityColumnContent item={props.row.original} />,
      enableSorting: true,
      maxSize: 15
    }),
    columnHelper.accessor(row => row.configuration.indicator.blueprint, {
      id: 'blueprint',
      header: t('in-service-levels:sloList.columnLabels.blueprint'),
      cell: props => <SloBlueprintColumnContent item={props.row.original} />,
      enableSorting: true,
      maxSize: 10
    }),
    columnHelper.display({
      id: 'errorBudget',
      header: t('in-service-levels:sloList.columnLabels.errorBudget'),
      cell: props => <SloErrorBudgetColumnContent item={props.row.original} showSparkChart={isMediumWidth} />,
      enableSorting: false,
      maxSize: 15
    }),
    columnHelper.accessor(row => row.status, {
      id: 'sloStatus',
      header: t('in-service-levels:sloList.columnLabels.status'),
      cell: props => <SloStatusColumnContent item={props.row.original} />,
      enableSorting: true,
      maxSize: 10
    }),
    columnHelper.accessor(row => row.configuration.tags, {
      id: 'tags',
      header: t('in-service-levels:sloList.columnLabels.tags'),
      cell: props => <SloTagsColumnContent item={props.row.original} />,
      enableSorting: false,
      maxSize: 18
    }),
    columnHelper.display({
      id: 'actions',
      cell: props => <SloActions item={props.row.original} />,
      enableSorting: false,
      maxSize: 5
    })
  ];

  return columns.filter(({ id }) => {
    // Hide blueprint column if showBluerprintCol is false
    return (id !== 'blueprint' || isSmallWidth) && (id !== 'entityType' || (showEntityInfo ?? true));
  });
}

interface SloListProps {
  pathSegment: string;
  matrixPrefix?: string;
  entityIds?: string;
  isDashboard?: boolean;
  showEntityInfo?: boolean;
}

export default function SloList({
  pathSegment,
  matrixPrefix = '',
  entityIds,
  isDashboard,
  showEntityInfo
}: SloListProps) {
  const isMediumWidth = useMediaQuery('(min-width: 1560px)');
  const isSmallWidth = useMediaQuery('(min-width: 1200px)');

  const [filterUrlPathParams, setFilterUrlPathParams] = useSloListFilterUrlState({ pathSegment, matrixPrefix });

  const {
    table,
    tableProps: { page, query, orderBy, orderDirection, setServerTableState },
    result
  } = useSloListTable({
    pathSegment,
    matrixPrefix,
    isMediumWidth,
    isSmallWidth,
    showEntityInfo,
    entityIds,
    filterUrlPathParams
  });

  const {
    filterPanelProps: {
      popoverOpen,
      setPopoverOpen,
      getFilterLabel,
      localFilters,
      setLocalFilters,
      setLocalFilterChange,
      setFilterFromColumnFilters,
      resetFilters,
      isFiltersEmpty
    },
    groups
  } = useSloListFilter({ filterUrlPathParams, setFilterUrlPathParams, query, setServerTableState });

  const { tableContainerRef, animatePanel } = useSloFilterPanelAnimation({ page, result });

  const [sloTags, , , tagsProgress] = useSloTags();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const availableTags = useMemo(() => sloTags ?? [], [generateStableHash(sloTags)]);
  const progress = all(tagsProgress, result.progress);
  const handleSloSearch = useDeboucedSearch(query => table.setGlobalFilter(query));

  return (
    <div ref={tableContainerRef}>
      <TableContainer className={cx({ [locals['popover-open']]: popoverOpen })} id={locals['slo-table-container']}>
        <TableToolbar>
          {!isDashboard && (
            <TableToolbarContent className={locals['toolbar-content']}>
              <IconButton
                disabled={progress.loading || result.errors.length > 0}
                wrapperClasses={locals['filter-button-container']}
                onClick={() => {
                  setPopoverOpen(prev => !prev);
                  animatePanel(popoverOpen);
                }}
                label={t('in-service-levels:general.filtering.filterLabel')}
                kind="ghost"
              >
                <Filter />
              </IconButton>

              <TableToolbarSearch
                defaultValue={table.getState().globalFilter}
                onChange={(_, value) => handleSloSearch(value)}
                disabled={result.errors.length > 0}
              />
              <Button
                renderIcon={Add}
                onClick={() =>
                  addActiveDialog(
                    <ConfigureSloDialog
                      mode="NEW"
                      trackingMeta={{ productArea: productAreas.slo, pageName: pageNames.service_levels }}
                    />
                  )
                }
                kind="primary"
              >
                {t('in-service-levels:sloList.components.sloListTable.serviceLevelsCreateButton')}
              </Button>
            </TableToolbarContent>
          )}
        </TableToolbar>
        {!progress.loading && (
          <TagFilters
            setFilterFromColumnFilters={setFilterFromColumnFilters}
            filters={filterUrlPathParams}
            getFilterLabel={getFilterLabel}
            setLocalFilters={setLocalFilters}
            resetFilters={resetFilters}
          />
        )}
        <FilterPanel
          popoverOpen={popoverOpen}
          closeButton={
            <IconButton
              wrapperClasses={locals['filter--panel__close-wrapper']}
              kind="ghost"
              className={locals['filter--panel__close']}
              aria-label="Close"
              label={t('in-service-levels:general.filtering.filterClose')}
              align="left"
              onClick={() => {
                setPopoverOpen(false);
                animatePanel(popoverOpen);
              }}
            >
              <Close />
            </IconButton>
          }
          filters={
            <SloListFilters
              groups={groups}
              sloStatus={mapColumnFiltersToUrlState(localFilters)?.sloStatus}
              tags={availableTags ?? ([] as string[])}
              selectedTags={mapColumnFiltersToUrlState(localFilters)?.tags}
              entityType={mapColumnFiltersToUrlState(localFilters)?.entityType}
              blueprint={mapColumnFiltersToUrlState(localFilters)?.blueprint}
              setFilter={setLocalFilterChange}
            />
          }
          secondaryButton={
            <Button
              kind="secondary"
              onClick={() => {
                setPopoverOpen(false);
                animatePanel(popoverOpen);
                if (!isFiltersEmpty) {
                  resetFilters();
                }
              }}
            >
              {t('in-service-levels:general.filtering.clearLabel')}
            </Button>
          }
          primaryButton={
            <Button
              kind="primary"
              onClick={() => {
                setPopoverOpen(false);
                animatePanel(popoverOpen);
                if (!isFiltersEmpty) {
                  setServerTableState({ page: 1 });
                  setFilterUrlPathParams(mapColumnFiltersToUrlState(localFilters));
                }
              }}
            >
              {t('in-service-levels:general.filtering.filterLabel')}
            </Button>
          }
        />
        {progress.loading ? (
          <TableSkeleton
            className={locals['table-skeleton']}
            showHeader={false}
            showToolbar={false}
            rowCount={10}
            columnCount={table.getAllColumns().length}
          />
        ) : (
          <Table
            size="lg"
            useZebraStyles={false}
            className={cx({
              [locals['empty-table-wrapper']]: table.getFilteredRowModel().rows.length === 0,
              [locals['table-fixed-layout']]: true
            })}
          >
            <TableHead>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHeader
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cx({
                        [locals[`w-${header.column.getSize()}`]]: true,
                        [locals['empty-column']]: header.id === 'actions'
                      })}
                      style={{
                        width: `${header.column.getCanSort() ? '100%' : undefined}`
                      }}
                      isSortHeader={orderBy === header.column.id}
                      isSortable={header.column.getCanSort() && table.getRowModel().rows.length !== 0}
                      sortDirection={orderDirection}
                      onClick={
                        table.getRowModel().rows.length !== 0 ? header.column.getToggleSortingHandler() : undefined
                      }
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHeader>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody
              className={cx({
                [locals['empty-table-body']]: table.getRowModel().rows.length === 0
              })}
            >
              {result.errors.length > 0 && (
                <TableRow>
                  <TableCell>
                    <ErrorEmptyState
                      title={t('in-service-levels:sloList.components.sloListTable.sloListErrorTitle')}
                      subtitle={t('in-service-levels:sloList.components.sloListTable.sloListErrorDescription')}
                      className={locals['empty-table']}
                    />
                  </TableCell>
                </TableRow>
              )}

              {table.getRowModel().rows.length === 0 && result.errors.length === 0 && (
                <TableRow>
                  <TableCell>
                    <NoDataEmptyState
                      title={t('in-service-levels:sloList.components.sloListTable.emptyListStateTitle')}
                      subtitle={t('in-service-levels:sloList.components.sloListTable.emptyListStateSubtitle')}
                      illustrationDescription={t(
                        'in-service-levels:sloList.components.sloListTable.emptyListStateIllustrationDescription'
                      )}
                      className={locals['empty-table']}
                    />
                  </TableCell>
                </TableRow>
              )}
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={locals.tableRowItem}
                      style={{
                        width: cell.column.getSize()
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!progress.loading && (
          <Pagination
            disabled={result.errors.length > 0}
            page={table.getState().pagination.pageIndex}
            totalItems={table.getRowCount()}
            pageSize={table.getState().pagination.pageSize}
            onChange={({ pageSize, page }) => {
              table.setPagination({ pageIndex: page, pageSize: Number(pageSize) });
            }}
          />
        )}
      </TableContainer>
    </div>
  );
}
