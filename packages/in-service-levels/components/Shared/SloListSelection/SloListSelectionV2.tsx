/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { flexRender, createColumnHelper } from '@tanstack/react-table';
import { Field, Item } from 'formalistic';
import React, { useRef } from 'react';
import cx from 'classnames';

import {
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableSelectRow,
  TableSelectAll,
  RadioButtonGroup,
  RadioButton
} from '@instana/carbon';
import { ValidationBlock, TableSkeleton, Pagination } from '@instana/components';
import { ErrorEmptyState, NoDataEmptyState } from '@instana/ibm-products';
import { SloEntityType } from '@instana/types';

import useSloListSelectionTable from 'in-service-levels/components/Shared/SloListSelection/hooks/useSloListSelectionTable';
import SloBlueprintColumnContent from 'in-service-levels/components/SloList/components/SloBlueprintColumnContent';
import { SloListFilterState } from 'in-service-levels/components/Shared/SloListSelection/hooks/useSloListFilters';
import SloEntityColumnContent from 'in-service-levels/components/SloList/components/SloEntityColumnContent';
import useSloListItems from 'in-service-levels/components/Shared/SloListSelection/hooks/useSloListItems';
import SloNameColumnContent from 'in-service-levels/components/SloList/components/SloNameColumnContent';
import SloTagsColumnContent from 'in-service-levels/components/SloList/components/SloTagsColumnContent';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import FilterFlyout from 'in-service-levels/components/Shared/Table/FilterFlyout';
import TagFilters from 'in-service-levels/components/Shared/Table/TagFilters';
import useDebouncedSearch from 'in-service-levels/hooks/useDebouncedSearch';
import { sloEntityTypes } from 'in-service-levels/constants';
import { isFieldValid } from 'in-service-levels/utils/form';
import { SelectSloListItem } from 'in-service-levels/types';
import { t } from 'in-i18n';

import locals from './SloListSelectionV2.mless';

const columnHelper = createColumnHelper<SelectSloListItem>();

const columns = [
  columnHelper.accessor(row => row.configuration.name, {
    id: 'name',
    cell: item => <SloNameColumnContent item={item.row.original} />,
    header: t('in-service-levels:sloList.columnLabels.name'),
    enableSorting: true
  }),
  columnHelper.accessor(row => row.configuration.entity.type, {
    id: 'entityType',
    header: t('in-service-levels:sloList.columnLabels.entity'),
    cell: props => <SloEntityColumnContent item={props.row.original} />,
    enableSorting: false
  }),
  columnHelper.accessor(row => row.configuration.indicator.blueprint, {
    id: 'blueprint',
    header: t('in-service-levels:sloList.columnLabels.blueprint'),
    cell: props => <SloBlueprintColumnContent item={props.row.original} />,
    enableSorting: false
  }),
  columnHelper.accessor(row => row.configuration.tags, {
    id: 'tags',
    header: t('in-service-levels:sloList.columnLabels.tags'),
    cell: props => <SloTagsColumnContent item={props.row.original} />,
    enableSorting: false
  })
];

const getFilterLabel = ({ id, value }: { id: string; value: string }) =>
  t('in-service-levels:sloListSelection.filters', { context: id, entity: value });

interface SloListSelectionProps extends SloListFilterState {
  sloIdsField: Field<string[]>;
  onSelect: (i: Item) => void;
}

export default function SloListSelection({
  sloIdsField,
  onSelect,
  columnFilters,
  localFilters,
  setFilters,
  resetFilters,
  toggleFilter,
  setColumnFiltersFromLocalFilters,
  resetLocalFiltersToColumnFilters
}: SloListSelectionProps) {
  const isSloIdsFieldValid = isFieldValid(sloIdsField);

  const containerRef = useRef<HTMLDivElement>(null);

  const [serverTableUrlState, setServerTableState] = useServerTableUrlState({
    pathSegment: '/scope',
    matrixPrefix: '',
    defaultOrderBy: 'name',
    defaultPageSize: 10
  });

  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  const entityType = columnFilters.find(filter => filter.id === 'entityType')?.value as SloEntityType | undefined;

  const [result, , errors, progress] = useSloListItems({
    page,
    pageSize,
    orderBy,
    orderDirection,
    query,
    entityType
  });

  const table = useSloListSelectionTable({
    result,
    serverTableUrlState,
    setServerTableState,
    sloIdsField,
    onSelect,
    columns
  });

  const isTableEmpty = table.getRowModel().rows.length === 0;

  const handleSloSearch = useDebouncedSearch(query => table.setGlobalFilter(query));

  return (
    <>
      <div ref={containerRef}>
        <TableContainer className={locals['slo-list-selection-container']}>
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch
                defaultValue={table.getState().globalFilter}
                disabled={errors.length > 0}
                onChange={(_, value) => handleSloSearch(value)}
                placeholder={t('in-service-levels:sloListSelection.searchSlos')}
                persistent
              />
              <FilterFlyout
                disabled={errors.length > 0}
                onClose={resetLocalFiltersToColumnFilters}
                onClickPrimary={setColumnFiltersFromLocalFilters}
                onClickSecondary={resetFilters}
                filters={
                  <RadioButtonGroup
                    onChange={entityType => toggleFilter(entityType as SloEntityType | undefined)}
                    valueSelected={
                      localFilters.find(filter => filter.id === 'entityType')?.value as SloEntityType | undefined
                    }
                    name="slo-entity-type-radio-button-group"
                    orientation="vertical"
                    legendText={t('in-service-levels:sloListSelection.entityType')}
                  >
                    <RadioButton labelText={t('in-service-levels:general.all')} value={undefined} />
                    {sloEntityTypes.map(entityType => (
                      <RadioButton
                        key={entityType}
                        labelText={t('in-service-levels:general.entityTypes.label', { context: entityType })}
                        value={entityType}
                      />
                    ))}
                  </RadioButtonGroup>
                }
              />
            </TableToolbarContent>
          </TableToolbar>
          <TagFilters
            columnFilters={columnFilters}
            setColumnFilters={setFilters}
            resetFilters={resetFilters}
            getFilterLabel={getFilterLabel}
          />

          {progress.loading ? (
            <TableSkeleton
              className={locals['table-skeleton']}
              showHeader={false}
              showToolbar={false}
              rowCount={table.getState().pagination.pageSize}
              columnCount={table.getAllColumns().length}
            />
          ) : (
            <>
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
                      <TableSelectAll
                        name="select all"
                        id="select-all"
                        disabled={result?.totalHits === 0}
                        aria-label="Select all"
                        checked={table.getIsAllPageRowsSelected()}
                        indeterminate={table.getIsSomePageRowsSelected()}
                        onSelect={table.getToggleAllPageRowsSelectedHandler()}
                      />
                      {headerGroup.headers.map(header => (
                        <TableHeader
                          key={header.id}
                          style={{
                            width: header.getSize()
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                          title={t('in-service-levels:general.errorEmptyListStateTitle')}
                          subtitle={t('in-service-levels:general.errorEmptyListStateSubtitle')}
                          illustrationDescription={t(
                            'in-service-levels:general.errorEmptyListStateIllustrationDescription'
                          )}
                          className={locals['empty-table']}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  {errors.length > 0 && (
                    <TableRow>
                      <TableCell>
                        <ErrorEmptyState
                          title={t('in-service-levels:general.errorEmptyListStateTitle')}
                          subtitle={t('in-service-levels:general.errorEmptyListStateSubtitle')}
                          illustrationDescription={t(
                            'in-service-levels:general.errorEmptyListStateIllustrationDescription'
                          )}
                          className={locals['empty-table']}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  {table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      <TableSelectRow
                        className={locals['table-select']}
                        onSelect={row.getToggleSelectedHandler()}
                        id={'select_row_' + row.id}
                        name={`${row.id} select`}
                        checked={row.getIsSelected()}
                        aria-label="Select row"
                      />

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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                disabled={errors.length > 0}
                page={table.getState().pagination.pageIndex}
                totalItems={table.getRowCount()}
                pageSize={table.getState().pagination.pageSize}
                onChange={({ pageSize, page }) => {
                  table.setPagination({ pageIndex: page, pageSize });
                }}
              />
            </>
          )}
        </TableContainer>
      </div>
      {!isSloIdsFieldValid &&
        sloIdsField.messages.map(({ message, path }, index) => (
          <ValidationBlock key={`${path}:${index}`}>{message}</ValidationBlock>
        ))}
    </>
  );
}
