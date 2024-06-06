/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Table, TableLoadingSkeletonRows, Tbody, Td, Th, Thead, Tr } from '@instana/legacy';
import { DeleteLogsHistoryItem, DeleteLogsHistoryResult, Result } from '@instana/types';
import { LoadingSkeleton, SvgIcon, Typography } from '@instana/components';
import { formatDate } from '@instana/format-date';
import { useObservable } from '@instana/hooks';

import getDeleteLogsHistory from 'in-logging/subscriptions/getDeleteLogsHistory';
import { siPrefixCompact } from 'in-stores/metric/formatters';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './DeletionTable.mless';

export const DeletionTable = ({ isDeleting }: { isDeleting: boolean }) => {
  const deletionHistoryResult =
    useObservable<Result<DeleteLogsHistoryResult>, [boolean]>(() => getDeleteLogsHistory(null), [isDeleting]) ??
    pendingResult;

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
  const getDataRows = () => {
    return deletionHistoryResult.data?.deletions
      .slice()
      .sort((a: DeleteLogsHistoryItem, b: DeleteLogsHistoryItem) => b.timestamp - a.timestamp)
      .map((item: DeleteLogsHistoryItem, i: number) => (
        <Tr key={i}>
          <Td>{timestampToLocaleDate(item.timestamp)}</Td>
          <Td>{item.reason}</Td>
          <Td>
            {item.deletedLineCount !== null ? (
              siPrefixCompact.formatter(item.deletedLineCount)
            ) : (
              <LoadingSkeleton className={locals.skeleton} />
            )}
          </Td>
          <Td>{item.triggeredByUser}</Td>
        </Tr>
      ));
  };
  return (
    <section className={locals.tableSection}>
      <Typography variant={'heading-200'}>{localisationStrings.summary}</Typography>
      <Table style={{ borderCollapse: 'collapse' }} fixedLayout className={locals.deletionTable}>
        <Thead>
          <Tr size="regular">
            <Th>{localisationStrings.deletionDate}</Th>
            <Th>{localisationStrings.reason}</Th>
            <Th>{localisationStrings.numberOfLogs}</Th>
            <Th>{localisationStrings.triggered}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading(deletionHistoryResult) && <TableLoadingSkeletonRows cols={4} rows={3} />}
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
    </section>
  );
};

const timestampToLocaleDate = (timestamp: number) => {
  const timestampDate = new Date(Math.round(timestamp / 1000000));
  return formatDate(timestampDate);
};
