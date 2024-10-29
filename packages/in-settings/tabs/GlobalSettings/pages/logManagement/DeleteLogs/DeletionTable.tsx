/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  LoadingSkeleton,
  SvgIcon,
  Typography,
  TableSkeleton as CarbonTableSkeleton,
  DataTable as CarbonDataTable,
  Card
} from '@instana/components';
import { Table, TableLoadingSkeletonRows, Tbody, Td, Th, Thead, Tr } from '@instana/legacy';
import { DeleteLogsHistoryItem, DeleteLogsHistoryResult, Result } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import getDeleteLogsHistory from 'in-logging/subscriptions/getDeleteLogsHistory';
import { siPrefixCompact } from 'in-stores/metric/formatters';
import { hasError, isLoading } from 'in-services/util/result';
import { carbonTableEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './DeletionTable.mless';

const DELETE_STATUS = {
  inProgress: 'In Progress',
  failed: 'Failed',
  done: 'Done'
} as const;

const localisationStrings = {
  deleteLogs: t('in-settings:tabs.deleteLogs.deleteLogs'),
  deletionDate: t('in-settings:tabs.deleteLogs.deletionDate'),
  reason: t('in-settings:tabs.deleteLogs.reason'),
  numberOfLogs: t('in-settings:tabs.deleteLogs.numberOfLogs'),
  triggered: t('in-settings:tabs.deleteLogs.triggered'),
  status: t('in-settings:tabs.deleteLogs.status'),
  noData: t('in-settings:tabs.deleteLogs.noData'),
  noDataInfo: t('in-settings:tabs.deleteLogs.noDataInfo'),
  summary: t('in-settings:tabs.deleteLogs.summary'),
  wrong: t('in-settings:tabs.deleteLogs.wrong'),
  errorInfo: t('in-settings:tabs.deleteLogs.errorInfo'),
  success: t('in-settings:tabs.deleteLogs.success'),
  failed: t('in-settings:tabs.deleteLogs.failed'),
  inProgress: t('in-settings:tabs.deleteLogs.inProgress')
};

export const DeletionTable = ({ isDeleting }: { isDeleting: boolean }) => {
  const deletionHistoryResult =
    useObservable<Result<DeleteLogsHistoryResult>, [boolean]>(() => getDeleteLogsHistory(null), [isDeleting]) ??
    pendingResult;
  if (carbonTableEnabled) {
    let carbonRows = [];

    let carbonHeaders: Array<{ key: string; header: string }> = [
      {
        key: localisationStrings.status,
        header: localisationStrings.status
      },
      {
        key: localisationStrings.deletionDate,
        header: localisationStrings.deletionDate
      },
      {
        key: localisationStrings.reason,
        header: localisationStrings.reason
      },
      {
        key: localisationStrings.numberOfLogs,
        header: localisationStrings.numberOfLogs
      },
      {
        key: localisationStrings.triggered,
        header: localisationStrings.triggered
      }
    ];

    const getCarbonDataRows = () => {
      carbonRows = deletionHistoryResult.data?.deletions
        .slice()
        .sort((a: DeleteLogsHistoryItem, b: DeleteLogsHistoryItem) => b.timestamp - a.timestamp)
        .map((item: DeleteLogsHistoryItem, i: number) => ({
          id: i,
          [localisationStrings.status]: renderIconsByStatus(item.deletedStatus),
          [localisationStrings.deletionDate]: timestampToLocaleDateTime(item.timestamp),
          [localisationStrings.reason]: item.reason,
          [localisationStrings.numberOfLogs]: getDeletedLineCount(item),
          [localisationStrings.triggered]: item.triggeredByUser
        }));
      return carbonRows;
    };

    if (deletionHistoryResult.data) carbonRows = getCarbonDataRows();

    return (
      <section>
        <Card size="s" disableLayer title={localisationStrings.summary} className={locals.deleteLogsSummaryCard}>
          {/* render skeleton table */}
          {isLoading(deletionHistoryResult) && (
            <CarbonTableSkeleton headers={carbonHeaders} columnCount={5} rowCount={3} />
          )}
        </Card>
        {/* render data table */}
        <Card size="s" className={locals.deleteLogsTableCard}>
          {deletionHistoryResult.data?.deletions.length > 0 && (
            <CarbonDataTable headers={carbonHeaders} rows={carbonRows} />
          )}
          {/* render noData table */}
          {deletionHistoryResult.data?.deletions.length === 0 && (
            <div className={locals.emptyTable}>
              <CarbonDataTable headers={carbonHeaders} rows={[]} isSearchEnabled={false} />
              <section className={locals.stateContainer}>
                <div data-testid="deletionTableEmpty" className={locals.emptyState}>
                  <SvgIcon type={'lib_help_error_info_outline'} size="xxxl" />
                  <Typography variant={'body-bold'}>{localisationStrings.noData}</Typography>
                  <Typography variant={'body-regular'}>{localisationStrings.noDataInfo}</Typography>
                </div>
              </section>
            </div>
          )}
          {/* render errorInfo table */}
          {hasError(deletionHistoryResult) && (
            <div className={locals.emptyTable}>
              <CarbonDataTable headers={carbonHeaders} rows={[]} isSearchEnabled={false} />
              <section className={locals.stateContainer}>
                <div data-testid={'deletionTableErrorMessage'} className={locals.emptyState}>
                  <SvgIcon type={'lib_help_error_error_circle'} size="xxxl" />
                  <Typography variant={'body-bold'}>{localisationStrings.wrong}</Typography>
                  <Typography variant={'body-regular'}>{localisationStrings.errorInfo}</Typography>
                </div>
              </section>
            </div>
          )}
        </Card>
      </section>
    );
  }

  const getDataRows = () => {
    return deletionHistoryResult.data?.deletions
      .slice()
      .sort((a: DeleteLogsHistoryItem, b: DeleteLogsHistoryItem) => b.timestamp - a.timestamp)
      .map((item: DeleteLogsHistoryItem, i: number) => (
        <Tr data-testid="deleteLogsHistoryRow" key={i}>
          <Td>{renderIconsByStatus(item.deletedStatus)}</Td>
          <Td>{timestampToLocaleDateTime(item.timestamp)}</Td>
          <Td>{item.reason}</Td>
          <Td>{getDeletedLineCount(item)}</Td>
          <Td>{item.triggeredByUser}</Td>
        </Tr>
      ));
  };

  return (
    <section>
      <Card size="s" disableLayer className={locals.deleteLogsTableCard}>
        <div className={locals.deleteLogsSummaryCard}>
          <Typography variant={'heading-200'}>{localisationStrings.summary}</Typography>
        </div>
        <Table style={{ borderCollapse: 'collapse' }} fixedLayout className={locals.deletionTable}>
          <Thead>
            <Tr size="regular">
              <Th>{localisationStrings.status}</Th>
              <Th>{localisationStrings.deletionDate}</Th>
              <Th>{localisationStrings.reason}</Th>
              <Th>{localisationStrings.numberOfLogs}</Th>
              <Th>{localisationStrings.triggered}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading(deletionHistoryResult) && <TableLoadingSkeletonRows cols={5} rows={3} />}
            {hasError(deletionHistoryResult) && (
              <Tr>
                <td colSpan={4}>
                  <section className={locals.stateContainer}>
                    <div className={locals.emptyState}>
                      <SvgIcon type={'lib_help_error_error_circle'} size="xxxl" />
                      <Typography variant={'body-bold'}>{localisationStrings.wrong}</Typography>
                      <Typography variant={'body-regular'}>{localisationStrings.errorInfo}</Typography>
                    </div>
                  </section>
                </td>
              </Tr>
            )}
            {deletionHistoryResult.data?.deletions.length === 0 && (
              <Tr>
                <td colSpan={4}>
                  <section className={locals.stateContainer}>
                    <div className={locals.emptyState}>
                      <SvgIcon type={'lib_help_error_info_outline'} size="xxxl" />
                      <Typography variant={'body-bold'}>{localisationStrings.noData}</Typography>
                      <Typography variant={'body-regular'}>{localisationStrings.noDataInfo}</Typography>
                    </div>
                  </section>
                </td>
              </Tr>
            )}
            {deletionHistoryResult.data && getDataRows()}
          </Tbody>
        </Table>
      </Card>
    </section>
  );
};

const timestampToLocaleDateTime = (timestamp: number) => {
  const timestampDate = new Date(Math.round(timestamp / 1000000));
  return timestampDate.toISOString().slice(0, 16).replace('T', ', ');
};

const renderIconsByStatus = (status: string) => {
  const icons: Record<string, JSX.Element> = {
    [DELETE_STATUS.done]: <SvgIcon type="lib_uncheck" size="s" color={themes.default.ids.color.option.green[500]} />,
    [DELETE_STATUS.failed]: (
      <SvgIcon type="lib_error_filled" size="s" color={themes.default.ids.color.option.red[500]} />
    ),
    [DELETE_STATUS.inProgress]: <div className={locals.spinner} />
  };
  return icons[status] || null;
};

const getDeletedLineCount = (item: DeleteLogsHistoryItem) => {
  if (item.deletedStatus === DELETE_STATUS.inProgress) {
    return '–';
  }

  if (item.deletedLineCount !== null) {
    return siPrefixCompact.formatter(item.deletedLineCount);
  }

  return <LoadingSkeleton className={locals.skeleton} />;
};
