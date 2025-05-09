/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import {
  Button,
  CarbonEmptyState,
  Card,
  DataTable as CarbonDataTable,
  SvgIcon,
  TableSkeleton,
  Pagination
} from '@instana/components';
import { DeleteLogsHistoryResult, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  carbonHeaders,
  getCarbonDataRows,
  getTableState,
  hasInProgressDeletion,
  TableState,
  urlStateDefinition
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { deletionTableLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import getDeleteLogsHistory from 'in-logging/subscriptions/getDeleteLogsHistory';
import { pendingResult } from 'in-services/fixedObjects';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

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
  // Add preserve state URL
  const allowedPageSizes = [10, 20, 30, 40, 50];

  const [{ page: rawPage, pageSize: rawPageSize }, setUrlState] = useUrlState(urlStateDefinition);

  const validatedPageSize = allowedPageSizes.includes(rawPageSize) ? rawPageSize : 10;
  const totalItems = getCarbonDataRows(result).length;
  const totalPages = Math.max(1, Math.ceil(totalItems / validatedPageSize));

  const validatedPage =
    Number.isInteger(rawPage) && rawPage >= 1 && rawPage <= totalPages ? rawPage : Math.min(1, totalPages);

  useEffect(() => {
    if (rawPage !== validatedPage || rawPageSize !== validatedPageSize) {
      setUrlState({ page: validatedPage, pageSize: validatedPageSize });
    }
  }, [rawPage, rawPageSize, validatedPage, validatedPageSize, setUrlState]);

  const allRows = getCarbonDataRows(result);
  const paginatedRows = allRows.slice((validatedPage - 1) * validatedPageSize, validatedPage * validatedPageSize);

  const handlePageChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
    setUrlState({ page, pageSize });
  };
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
    <>
      <CarbonDataTable
        title={deletionTableLocalisationStrings.summary}
        headers={carbonHeaders}
        rows={paginatedRows}
        toolBarContent={<DeleteButton openConfirmationDialog={openConfirmationDialog} />}
      />
      <Pagination
        page={validatedPage}
        pageSize={validatedPageSize}
        totalItems={totalItems}
        onChange={handlePageChange}
        pageSizes={allowedPageSizes}
        itemsPerPageText={t('in-settings:tabs.deleteLogs.itemsPerPage')}
      />
    </>
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
  openConfirmationDialog,
  handleIsInProgress
}: {
  isDeleting: boolean;
  openConfirmationDialog: () => void;
  handleIsInProgress: (isInProgress: boolean) => void;
}) => {
  const deletionHistoryResult =
    useObservable<Result<DeleteLogsHistoryResult>, [boolean]>(() => getDeleteLogsHistory(null), [isDeleting]) ??
    pendingResult;

  handleIsInProgress(hasInProgressDeletion(deletionHistoryResult));

  return <CarbonDeletionTable openConfirmationDialog={openConfirmationDialog} result={deletionHistoryResult} />;
};
