/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { format } from 'date-fns';
import React from 'react';

import { DeleteLogsHistoryItem, DeleteLogsHistoryResult, Result } from '@instana/types';
import { IconButton, LoadingSkeleton } from '@instana/components';
import { DateFormatterOutput } from '@instana/format-date';
import { themes } from '@instana/design-tokens';

import { deletionTableLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import { getDesignLibraryColorBySeverity, getDesignLibrarySeverityIcon } from 'in-stores/events';
import { siPrefixCompact } from 'in-stores/metric/formatters';
import { hasError, isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeletionTable.mless';

export const DELETE_STATUS = {
  inProgress: 'In Progress',
  failed: 'Failed',
  done: 'Done'
} as const;

export interface DeleteLogsRequest {
  triggeredByUser: string;
  reason: string;
  upToTime: number;
  upToTimeDateFormat?: DateFormatterOutput;
  rowsToDelete?: number;
  status?: string;
  retryCount?: number;
  errorMessage?: string;
}

export const timestampToLocaleDateTime = (timestamp: number) => {
  const timestampDate = new Date(Math.round(timestamp / 1000000));
  return timestampDate.toISOString().slice(0, 16).replace('T', ', ');
};

export const renderIconsByStatus = (status: string) => {
  const icons: Record<string, JSX.Element> = {
    [DELETE_STATUS.done]: (
      <IconButton
        type="lib_uncheck"
        color={themes.default.ids.color.option.green[500]}
        iconSize={'xs'}
        isWrapperedByTooltip
        iconDescription={t('in-logging:tooltipEntityHealthNoIssues')}
        enterDelayMs={500}
      />
    ),
    [DELETE_STATUS.failed]: (
      <IconButton
        type={getDesignLibrarySeverityIcon(10)}
        color={getDesignLibraryColorBySeverity(10)}
        iconSize={'xs'}
        isWrapperedByTooltip
        iconDescription={t('in-logging:tooltipEntityHealthFailed')}
        enterDelayMs={500}
      />
    ),

    [DELETE_STATUS.inProgress]: (
      <IconButton
        type={'lib_actions_loading'}
        iconSize={'xs'}
        isWrapperedByTooltip
        iconSpinning
        iconDescription={t('in-logging:tooltipEntityHealthInProgress')}
        enterDelayMs={500}
      />
    )
  };
  return icons[status] || null;
};

export const getDeletedLineCount = (item: DeleteLogsHistoryItem) => {
  if (item.deletedStatus === (DELETE_STATUS.inProgress as any)) {
    return '–';
  }

  if (item.deletedLineCount !== null) {
    return siPrefixCompact.formatter(item.deletedLineCount);
  }

  return <LoadingSkeleton className={locals.skeleton} />;
};

export let carbonHeaders: Array<{ key: string; header: string }> = [
  {
    key: deletionTableLocalisationStrings.status,
    header: deletionTableLocalisationStrings.status
  },
  {
    key: deletionTableLocalisationStrings.deletionDate,
    header: deletionTableLocalisationStrings.deletionDate
  },
  {
    key: deletionTableLocalisationStrings.reason,
    header: deletionTableLocalisationStrings.reason
  },
  {
    key: deletionTableLocalisationStrings.numberOfLogs,
    header: deletionTableLocalisationStrings.numberOfLogs
  },
  {
    key: deletionTableLocalisationStrings.triggered,
    header: deletionTableLocalisationStrings.triggered
  }
];

export const getCarbonDataRows = (deletionHistoryResult: Result<DeleteLogsHistoryResult>) => {
  if (!deletionHistoryResult.data?.deletions) return [];

  return deletionHistoryResult.data?.deletions
    .slice()
    .sort((a: DeleteLogsHistoryItem, b: DeleteLogsHistoryItem) => b.timestamp - a.timestamp)
    .map((item: DeleteLogsHistoryItem, i: number) => ({
      id: String(i),
      [deletionTableLocalisationStrings.status]: renderIconsByStatus(item.deletedStatus),
      [deletionTableLocalisationStrings.deletionDate]: timestampToLocaleDateTime(item.timestamp),
      [deletionTableLocalisationStrings.reason]: item.reason,
      [deletionTableLocalisationStrings.numberOfLogs]: getDeletedLineCount(item),
      [deletionTableLocalisationStrings.triggered]: item.triggeredByUser
    }));
};

export enum TableState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  EMPTY = 'EMPTY',
  ERROR = 'ERROR'
}

export const getTableState = (result: Result<DeleteLogsHistoryResult>): TableState => {
  if (hasError(result)) {
    return TableState.ERROR;
  }
  if (isLoading(result)) {
    return TableState.LOADING;
  }
  if (result.data?.deletions?.length! > 0) {
    return TableState.SUCCESS;
  }
  if (result.data?.deletions?.length === 0) {
    return TableState.EMPTY;
  }
  return TableState.EMPTY;
};

export function addSecondsIfValidFormat(timeInputValue: string) {
  const regex = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;

  if (regex.test(timeInputValue)) {
    return `${timeInputValue}:00`;
  }

  return timeInputValue;
}

export const bytesToLargerUnit = (bytes: number, round?: number): { amount: number; localizedUnit: string } => {
  const TiBinBytes = 1099511627776;
  const isMoreThanTiB = bytes >= TiBinBytes;
  const dataUnitScale = isMoreThanTiB ? 4 : 3;

  const convertedBytes = bytes / Math.pow(1024, dataUnitScale);
  const roundedConvertedBytes = round !== undefined ? parseFloat(convertedBytes.toFixed(round)) : convertedBytes;

  const localizedUnit = t(`in-logging:dashboard.logVolume.${isMoreThanTiB ? 'tib' : 'gib'}`);

  return { amount: roundedConvertedBytes, localizedUnit };
};

export const getMonthName = (month: number): string => {
  const date = new Date(2000, month - 1);
  return format(date, 'MMMM');
};
