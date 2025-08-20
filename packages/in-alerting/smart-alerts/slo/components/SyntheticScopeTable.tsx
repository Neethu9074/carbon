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
import React, { useMemo, useState } from 'react';
import classNames from 'classnames';

import { Accordion, AccordionItem, ContainedList, ContainedListItem, ExpandableSearch, Link } from '@instana/carbon';
import { LoadingSkeleton, Pagination } from '@instana/components';
import { NoDataEmptyState } from '@instana/ibm-products';
import { Error, SyntheticTest } from '@instana/types';
import { generateStableHash } from '@instana/utils';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { useSyntheticTestDashboard } from 'in-synthetics/navigation/paths';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

import locals from './SyntheticScopeTable.mless';

interface SyntheticScopeTableProps {
  syntheticTests: SyntheticTest[];
  errors: Error[];
  status: FetchStatus;
}

export default function SyntheticScopeTable({ syntheticTests, errors, status }: SyntheticScopeTableProps) {
  const [open, setOpen] = useState(true);
  if (status === 'pending') {
    return <LoadingSkeleton className={locals.listSkeleton} />;
  }
  if (errors.length > 0) {
    return <ErroneousResultPresenter errors={errors} />;
  }

  return (
    <Accordion className={locals.accordian}>
      <AccordionItem
        open={open}
        onHeadingClick={({ isOpen }) => setOpen(isOpen)}
        title={t('in-alerting:smartAlerts.slo.components.syntheticScopeTable.title', {
          count: syntheticTests.length
        })}
      >
        <SyntheticTestsList syntheticTests={syntheticTests} />
      </AccordionItem>
    </Accordion>
  );
}

function LinkToSyntheticTest({ syntheticTest }: { syntheticTest: SyntheticTest }) {
  const getSyntheticDashboard = useSyntheticTestDashboard();
  const { id, label } = syntheticTest;
  const syntheticDashboardHref = getSyntheticDashboard({ testId: id!, testLabel: label });

  return <Link href={syntheticDashboardHref}>{label}</Link>;
}

const columnHelper = createColumnHelper<SyntheticTest>();

const columns = [
  columnHelper.accessor(row => row.label, {
    id: 'label',
    cell: props => <LinkToSyntheticTest syntheticTest={props.cell.row.original} />
  })
];

function useSyntheticTestsTable(syntheticTests: SyntheticTest[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => syntheticTests, [generateStableHash(syntheticTests)]);

  return useReactTable({
    columns,
    data,
    initialState: { pagination: { pageSize: 5 } },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });
}

function SyntheticTestsList({ syntheticTests }: { syntheticTests: SyntheticTest[] }) {
  const table = useSyntheticTestsTable(syntheticTests);

  const isTableEmpty = table.getRowModel().rows.length === 0;

  return (
    <ContainedList
      label=""
      kind="on-page"
      className={classNames({ [locals['empty-list']]: isTableEmpty })}
      action={
        <ExpandableSearch
          onChange={e => table.setGlobalFilter(e.target.value)}
          value={table.getState().globalFilter}
          labelText=""
          isExpanded
          size="lg"
          placeholder={t('in-alerting:smartAlerts.slo.components.syntheticScopeTable.searchPlaceholder')}
        />
      }
    >
      {isTableEmpty && (
        <NoDataEmptyState
          title={t('in-service-levels:general.noDataEmptyListStateTitle')}
          subtitle={t('in-service-levels:general.noDataEmptyListStateSubtitle')}
          illustrationDescription={t('in-service-levels:general.noDataEmptyListStateIllustrationDescription')}
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
