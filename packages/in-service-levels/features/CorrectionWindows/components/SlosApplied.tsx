/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import React, { useMemo } from 'react';
import cx from 'classnames';

import { ContainedList, ContainedListItem, ExpandableSearch } from '@instana/carbon';
import { ErrorEmptyState, NoDataEmptyState } from '@instana/ibm-products';
import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Link, Pagination } from '@instana/components';
import { generateStableHash } from '@instana/utils';

import useGetHrefToSloDashboard from 'in-service-levels/navigation/hooks/useGetHrefToSloDashboard';
import { CorrectionWindowListItem } from 'in-service-levels/types';
import { t } from 'in-i18n';

import locals from './SlosApplied.mless';

function LinkToSloDashboard({ slo }: { slo: ServiceLevelObjectiveConfiguration }) {
  const getHrefToSloDashboard = useGetHrefToSloDashboard();
  return <Link href={getHrefToSloDashboard(slo.id!)}>{slo.name}</Link>;
}

const columnHelper = createColumnHelper<ServiceLevelObjectiveConfiguration>();

const columns = [
  columnHelper.accessor(row => row.name, {
    id: 'name',
    cell: props => <LinkToSloDashboard slo={props.cell.row.original} />
  })
];

function useSlosAppliedTable(item: CorrectionWindowListItem) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => item.slos, [generateStableHash(item.slos)]);

  return useReactTable({
    columns,
    data,
    initialState: { pagination: { pageSize: 5 } },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });
}

interface SlosAppliedProps {
  item: CorrectionWindowListItem;
  className: string;
}

export default function SlosApplied({ item, className }: SlosAppliedProps) {
  const table = useSlosAppliedTable(item);

  const isTableEmpty = table.getRowModel().rows.length === 0;
  // TODO: this can probably be improved
  const failedToLoadSlos = item.slos.length !== (item.configuration.sloIds?.length ?? 0);
  return (
    <ContainedList
      label={t('in-service-levels:correctionWindowsList.slosApplied', { count: item.slos.length })}
      kind="on-page"
      className={cx({
        [className]: className,
        [locals['empty-list']]: isTableEmpty || failedToLoadSlos
      })}
      action={
        <ExpandableSearch
          onChange={e => table.setGlobalFilter(e.target.value)}
          value={table.getState().globalFilter}
          labelText=""
          disabled={failedToLoadSlos}
          size="lg"
          placeholder={t('in-service-levels:correctionWindowsList.searchSlosApplied')}
        />
      }
    >
      {isTableEmpty && !failedToLoadSlos && (
        <NoDataEmptyState
          title={t('in-service-levels:general.noDataEmptyListStateTitle')}
          subtitle={t('in-service-levels:general.noDataEmptyListStateSubtitle')}
          illustrationDescription={t('in-service-levels:general.noDataEmptyListStateIllustrationDescription')}
        />
      )}
      {failedToLoadSlos && (
        <ErrorEmptyState
          title={t('in-service-levels:sloList.components.sloListTable.sloListErrorTitle')}
          subtitle={t('in-service-levels:sloList.components.sloListTable.sloListErrorDescription')}
        />
      )}
      {table.getRowModel().rows.map(row => {
        const [cell] = row.getVisibleCells();
        return (
          <ContainedListItem key={cell.row.original.id!}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </ContainedListItem>
        );
      })}
      <Pagination
        disabled={failedToLoadSlos}
        page={table.getState().pagination.pageIndex + 1}
        totalItems={table.getRowCount()}
        pageSize={table.getState().pagination.pageSize}
        onChange={({ pageSize, page }) => {
          table.setPagination({ pageIndex: page - 1, pageSize });
        }}
        pageSizes={[5, 10, 20, 30, 40, 50]}
      />
    </ContainedList>
  );
}
