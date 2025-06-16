/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { flexRender, createColumnHelper } from '@tanstack/react-table';
import { Add } from '@carbon/icons-react';
import React, { Fragment } from 'react';
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
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow
} from '@instana/carbon';
import { ErrorEmptyState, NoDataEmptyState } from '@instana/ibm-products';
import { Pagination, TableSkeleton } from '@instana/components';

import ConfigureCorrectionWindowDialog from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/ConfigureCorrectionWindowDialog';
import useCorrectionConfigurationListItems from 'in-service-levels/features/CorrectionWindows/hooks/useCorrectionConfigurationListItems';
import {
  getDurationInMs,
  getNextOccurence
} from 'in-service-levels/features/CorrectionWindows/utils/CorrectionConfiguration';
import NextOccurrenceColumnContent from 'in-service-levels/features/CorrectionWindows/components/NextOccurrenceColumnContent';
import useCorrectionWindowsTable from 'in-service-levels/features/CorrectionWindows/hooks/useCorrectionConfigurationsTable';
import CorrectionWindowNameColumnContent from 'in-service-levels/features/CorrectionWindows/components/NameColumnContent';
import RecurrenceColumnContent from 'in-service-levels/features/CorrectionWindows/components/RecurrenceColumnContent';
import { SloUrlState, defaultServiceLevelObjectiveUrlParameters } from 'in-service-levels/navigation/urlParameters';
import DurationColumnContent from 'in-service-levels/features/CorrectionWindows/components/DurationColumnContent';
import ActionsColumnContent from 'in-service-levels/features/CorrectionWindows/components/ActionsColumnContent';
import StateColumnContent from 'in-service-levels/features/CorrectionWindows/components/StateColumnContent';
import ExpandedRowContent from 'in-service-levels/features/CorrectionWindows/components/ExpandedRowContent';
import StateHeaderContent from 'in-service-levels/features/CorrectionWindows/components/StateHeaderContent';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { serviceLevelsCorrectionWindowsSegment } from 'in-service-levels/navigation/path';
import useDebouncedSearch from 'in-service-levels/hooks/useDebouncedSearch';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { CorrectionWindowListItem } from 'in-service-levels/types';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from './CorrectionWindows.mless';

const columnHelper = createColumnHelper<CorrectionWindowListItem>();

const columns = [
  columnHelper.accessor(row => row.configuration.name, {
    id: 'name',
    cell: props => <CorrectionWindowNameColumnContent item={props.row.original.configuration} />,
    header: t('in-service-levels:correctionWindowsList.columnLabels.name'),
    enableSorting: true,
    size: 30
  }),
  columnHelper.display({
    id: 'recurrence',
    cell: props => <RecurrenceColumnContent item={props.row.original.configuration} />,
    header: t('in-service-levels:correctionWindowsList.columnLabels.recurrence'),
    enableSorting: true,
    size: 20
  }),
  columnHelper.accessor(row => getNextOccurence(row.configuration), {
    id: 'nextStart',
    cell: props => <NextOccurrenceColumnContent item={props.row.original.configuration} />,
    header: t('in-service-levels:correctionWindowsList.columnLabels.nextOccurrence'),
    enableSorting: true,
    size: 20
  }),
  columnHelper.accessor(row => getDurationInMs(row.configuration), {
    id: 'duration',
    cell: props => <DurationColumnContent item={props.row.original.configuration} />,
    header: t('in-service-levels:correctionWindowsList.columnLabels.duration'),
    enableSorting: true,
    size: 15
  }),
  columnHelper.display({
    id: 'state',
    header: StateHeaderContent,
    cell: props => <StateColumnContent item={props.row.original.configuration} />,
    enableSorting: false,
    size: 10
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: props => <ActionsColumnContent item={props.row.original.configuration} />,
    enableSorting: false,
    size: 5
  })
];

const pathSegment = serviceLevelsCorrectionWindowsSegment;
const matrixPrefix = '';

export default function CorrectionWindows() {
  const [{ sloId }] = useUrlState<SloUrlState | { sloId: undefined }>({
    bind: [defaultServiceLevelObjectiveUrlParameters.sloId]
  });

  const meta = {
    productArea: productAreas.slo,
    pageName: sloId ? pageNames.slo_correction_windows : pageNames.correction_windows
  };

  const [serverTableUrlState, setServerTableState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'name',
    defaultPageSize: 10,
    paginationResettingUrlParameters: [defaultServiceLevelObjectiveUrlParameters.sloId]
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  const [result, , errors, progress] = useCorrectionConfigurationListItems({
    page,
    orderBy,
    orderDirection,
    query,
    pageSize,
    sloId
  });

  const table = useCorrectionWindowsTable({
    result,
    serverTableUrlState,
    setServerTableState,
    columns
  });

  const isTableEmpty = table.getRowModel().rows.length === 0;

  const openCreateCorrectionWindowDialog = () =>
    addActiveDialog(<ConfigureCorrectionWindowDialog mode="NEW" trackingMeta={meta} />);

  const handleCorrectionWindowsSearch = useDebouncedSearch(query => table.setGlobalFilter(query));

  return (
    <TableContainer id={locals['correction-windows-table-container']}>
      <TableToolbar>
        <TableToolbarContent>
          <TableToolbarSearch
            persistent
            defaultValue={table.getState().globalFilter}
            disabled={errors.length > 0}
            placeholder={t('in-service-levels:correctionWindowsList.searchCorrectionWindows')}
            onChange={(_, value) => handleCorrectionWindowsSearch(value)}
          />
          <Button renderIcon={Add} onClick={openCreateCorrectionWindowDialog} kind="primary">
            {t('in-service-levels:correctionWindowsList.createButtonLabel')}
          </Button>
        </TableToolbarContent>
      </TableToolbar>
      {progress.loading ? (
        <TableSkeleton
          className={locals['table-skeleton']}
          showHeader={false}
          showToolbar={false}
          rowCount={pageSize}
          columnCount={table.getAllColumns().length}
        />
      ) : (
        <Table
          size="lg"
          className={cx({
            [locals['empty-table-wrapper']]: isTableEmpty,
            [locals['table-fixed-layout']]: true
          })}
        >
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                <TableExpandHeader className={locals['empty-column']} />
                {headerGroup.headers.map(header => (
                  <TableHeader
                    key={header.id}
                    className={cx({
                      [locals[`w-${header.column.getSize()}`]]: true,
                      [locals['empty-column']]: header.id === 'actions'
                    })}
                    isSortHeader={orderBy === header.column.id}
                    isSortable={header.column.getCanSort() && table.getRowModel().rows.length !== 0}
                    sortDirection={orderDirection}
                    style={
                      header.column.getCanSort() && table.getRowModel().rows.length !== 0
                        ? { width: '100%' }
                        : undefined
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHeader>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody
            className={cx({
              [locals['empty-table-body']]: isTableEmpty
            })}
          >
            {isTableEmpty && errors.length === 0 && (
              <TableRow>
                <TableCell>
                  <NoDataEmptyState
                    title={t('in-service-levels:general.noDataEmptyListStateTitle')}
                    subtitle={t('in-service-levels:general.noDataEmptyListStateSubtitle')}
                    illustrationDescription={t('in-service-levels:general.noDataEmptyListStateIllustrationDescription')}
                    className={locals['empty-table']}
                  />
                </TableCell>
              </TableRow>
            )}
            {errors.length > 0 && (
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
            {table.getRowModel().rows.map(row => (
              <Fragment key={row.id}>
                <TableExpandRow
                  onExpand={row.getToggleExpandedHandler()}
                  isExpanded={row.getIsExpanded()}
                  aria-label="Row expander"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize()
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableExpandRow>
                <TableExpandedRow colSpan={columns.length + 1}>
                  <ExpandedRowContent item={row.original} />
                </TableExpandedRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      )}
      <Pagination
        disabled={errors.length > 0}
        page={table.getState().pagination.pageIndex}
        totalItems={table.getRowCount()}
        pageSize={table.getState().pagination.pageSize}
        onChange={({ pageSize, page }) => {
          table.setPagination({ pageIndex: page, pageSize });
        }}
      />
    </TableContainer>
  );
}
