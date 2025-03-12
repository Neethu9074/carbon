/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  Button,
  CarbonEmptyState,
  Card,
  DataTable as CarbonDataTable,
  SvgIcon,
  TableSkeleton
} from '@instana/components';
import { DeleteLogsHistoryResult, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  carbonHeaders,
  getCarbonDataRows,
  getTableState,
  TableState
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { deletionTableLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import getDeleteLogsHistory from 'in-logging/subscriptions/getDeleteLogsHistory';
import { pendingResult } from 'in-services/fixedObjects';

import locals from './DeletionTable.mless';

const DeleteButton = ({ openConfirmationDialog }: { openConfirmationDialog: () => void }) => (
  <Button className={locals.deleteButton} onClick={openConfirmationDialog} kind="danger">
    {deletionTableLocalisationStrings.deleteLogs}
    <SvgIcon type="lib_actions_delete" size="xs" />
  </Button>
);

export const CarbonDeletionTable = ({
  result,
  openConfirmationDialog
}: {
  result: Result<DeleteLogsHistoryResult>;
  openConfirmationDialog: () => void;
}) => {
  const LoadingSkeleton = <TableSkeleton headers={carbonHeaders} showHeader showToolbar />;

  const EmptyState = (
    <div className={locals.emptyTable}>
      <CarbonDataTable
        headers={carbonHeaders}
        rows={[]}
        toolBarContent={<DeleteButton openConfirmationDialog={openConfirmationDialog} />}
      />
      <section className={locals.stateContainer}>
        <div data-testid="deletionTableEmpty" className={locals.emptyState}>
          <CarbonEmptyState
            icon="lib_carbon_empty_state"
            text={deletionTableLocalisationStrings.noDataInfo}
            title={deletionTableLocalisationStrings.noData}
          />
        </div>
      </section>
    </div>
  );

  const ErrorState = (
    <div className={locals.emptyTable}>
      <CarbonDataTable
        headers={carbonHeaders}
        rows={[]}
        toolBarContent={<DeleteButton openConfirmationDialog={openConfirmationDialog} />}
      />
      <section className={locals.stateContainer}>
        <div data-testid={'deletionTableErrorMessage'} className={locals.emptyState}>
          <CarbonEmptyState
            icon="lib_carbon_empty_state"
            text={deletionTableLocalisationStrings.errorInfo}
            title={deletionTableLocalisationStrings.wrong}
          />
        </div>
      </section>
    </div>
  );

  const DataTable = (
    <CarbonDataTable
      title={deletionTableLocalisationStrings.summary}
      headers={carbonHeaders}
      rows={getCarbonDataRows(result)}
      toolBarContent={<DeleteButton openConfirmationDialog={openConfirmationDialog} />}
    />
  );

  const content = {
    [TableState.LOADING]: LoadingSkeleton,
    [TableState.EMPTY]: EmptyState,
    [TableState.ERROR]: ErrorState,
    [TableState.SUCCESS]: DataTable
  };

  return (
    <section>
      <Card className={locals.deleteLogsTableCard}>{content[getTableState(result)]}</Card>
    </section>
  );
};

export const DeletionTable = ({
  isDeleting,
  openConfirmationDialog
}: {
  isDeleting: boolean;
  openConfirmationDialog: () => void;
}) => {
  const deletionHistoryResult =
    useObservable<Result<DeleteLogsHistoryResult>, [boolean]>(() => getDeleteLogsHistory(null), [isDeleting]) ??
    pendingResult;
  return <CarbonDeletionTable openConfirmationDialog={openConfirmationDialog} result={deletionHistoryResult} />;
};
