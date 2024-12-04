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
  TableSkeleton,
  Typography
} from '@instana/components';
import { Table, TableLoadingSkeletonRows, Tbody, Th, Thead, Tr } from '@instana/legacy';
import { DeleteLogsHistoryResult, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  carbonHeaders,
  getCarbonDataRows,
  getDataRows,
  getTableState,
  TableState
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { deletionTableLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import getDeleteLogsHistory from 'in-logging/subscriptions/getDeleteLogsHistory';
import { carbonTableEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';

import locals from './DeletionTable.mless';

const DeleteButton = ({ openConfirmationDialog }: { openConfirmationDialog: () => void }) => (
  <Button className={locals.deleteButton} onClick={openConfirmationDialog} kind="danger">
    {deletionTableLocalisationStrings.deleteLogs}
    <SvgIcon type="lib_actions_delete" size="xs" />
  </Button>
);

const CarbonDeletionTable = ({
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

const InstanaDeletionTable = ({ result }: { result: Result<DeleteLogsHistoryResult> }) => {
  const LoadingSkeleton = <TableLoadingSkeletonRows cols={5} rows={3} />;

  const EmptyState = (
    <Tr>
      <td colSpan={4}>
        <section className={locals.stateContainer}>
          <div className={locals.emptyState}>
            <SvgIcon type="lib_help_error_info_outline" size="xxxl" />
            <Typography variant="body-bold">{deletionTableLocalisationStrings.noData}</Typography>
            <Typography variant="body-regular">{deletionTableLocalisationStrings.noDataInfo}</Typography>
          </div>
        </section>
      </td>
    </Tr>
  );

  const ErrorState = (
    <Tr>
      <td colSpan={4}>
        <section className={locals.stateContainer}>
          <div className={locals.emptyState}>
            <SvgIcon type="lib_help_error_error_circle" size="xxxl" />
            <Typography variant="body-bold">{deletionTableLocalisationStrings.wrong}</Typography>
            <Typography variant="body-regular">{deletionTableLocalisationStrings.errorInfo}</Typography>
          </div>
        </section>
      </td>
    </Tr>
  );

  const DataTable = result.data && getDataRows(result);

  const content = {
    [TableState.LOADING]: LoadingSkeleton,
    [TableState.EMPTY]: EmptyState,
    [TableState.ERROR]: ErrorState,
    [TableState.SUCCESS]: DataTable
  };

  return (
    <section>
      <Card className={locals.deleteLogsTableCard}>
        <div className={locals.deleteLogsSummaryCard}>
          <Typography variant="heading-200">{deletionTableLocalisationStrings.summary}</Typography>
        </div>
        <Table style={{ borderCollapse: 'collapse' }} fixedLayout className={locals.deletionTable}>
          <Thead>
            <Tr size="regular">
              <Th>{deletionTableLocalisationStrings.status}</Th>
              <Th>{deletionTableLocalisationStrings.deletionDate}</Th>
              <Th>{deletionTableLocalisationStrings.reason}</Th>
              <Th>{deletionTableLocalisationStrings.numberOfLogs}</Th>
              <Th>{deletionTableLocalisationStrings.triggered}</Th>
            </Tr>
          </Thead>
          <Tbody>{content[getTableState(result)]}</Tbody>
        </Table>
      </Card>
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

  if (carbonTableEnabled)
    return <CarbonDeletionTable openConfirmationDialog={openConfirmationDialog} result={deletionHistoryResult} />;

  return <InstanaDeletionTable result={deletionHistoryResult} />;
};
