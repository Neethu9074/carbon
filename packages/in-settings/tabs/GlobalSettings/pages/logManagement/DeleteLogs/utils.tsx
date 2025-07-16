/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { differenceInMilliseconds, format, isAfter, isSameSecond, isValid, setHours, setMinutes } from 'date-fns';
import React from 'react';

import { DeleteLogsHistoryItem, DeleteLogsHistoryResult, Result, TimeConfig } from '@instana/types';
import { DateFormatterOutput, formatDateTime } from '@instana/format-date';
import { IconButton, LoadingSkeleton } from '@instana/components';
import { themes } from '@instana/design-tokens';

import {
  deleteLogsLocalisationStrings as literals,
  deletionTableLocalisationStrings,
  modalLocalisationStrings
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import { InputValues } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsV3/modalTypes';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getDesignLibraryColorBySeverity, getDesignLibrarySeverityIcon } from 'in-stores/events';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { siPrefixCompact } from 'in-stores/metric/formatters';
import { hasError, isLoading } from 'in-services/util/result';
import { Options } from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeletionTable.mless';

export const DELETE_STATUS = {
  inProgress: 'In Progress',
  failed: 'Failed',
  done: 'Done'
} as const;

export interface DeleteLogsV3Request {
  triggeredByUser: string;
  reason: string;
  timeConfig: Pick<TimeConfig, 'windowSize' | 'to'>;
  tagFilterExpression: ReturnType<typeof toBackendQueryModel>;
}

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
  return formatDateTime(Math.floor(timestamp / 1000000));
};

export const renderIconsByStatus = (status: string) => {
  const icons: Record<string, JSX.Element> = {
    [DELETE_STATUS.done]: (
      <IconButton
        type="lib_uncheck"
        color={themes.default.ids.color.option.green[500]}
        iconSize={'xs'}
        isWrapperedByTooltip
        iconDescription={t('in-logging:deleteLogsTootilpSuccess')}
        enterDelayMs={500}
      />
    ),
    [DELETE_STATUS.failed]: (
      <IconButton
        type={getDesignLibrarySeverityIcon(10)}
        color={getDesignLibraryColorBySeverity(10)}
        iconSize={'xs'}
        isWrapperedByTooltip
        iconDescription={t('in-logging:deleteLogsTooltipFailed')}
        enterDelayMs={500}
      />
    ),

    [DELETE_STATUS.inProgress]: (
      <IconButton
        type={'lib_actions_loading'}
        iconSize={'xs'}
        isWrapperedByTooltip
        iconSpinning
        iconDescription={t('in-logging:deleteLogsTooltipInProgress')}
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

export const urlStateDefinition: Options<{ page: number; pageSize: number }> = {
  bind: [
    {
      path: '/delete',
      name: 'page',
      as: 'page',
      initialState: 1,
      parser: buildJsonParser(),
      serializer: buildJsonSerializer()
    },
    {
      path: '/delete',
      name: 'pageSize',
      as: 'pageSize',
      initialState: 10,
      parser: buildJsonParser(),
      serializer: buildJsonSerializer()
    }
  ],
  reducer: (prevState, { page, pageSize }) => ({
    page: page ?? prevState.page,
    pageSize: pageSize ?? prevState.pageSize
  })
};

export const hasInProgressDeletion = (result: Result<DeleteLogsHistoryResult>) =>
  result.data?.deletions?.some(item => item.deletedStatus === DELETE_STATUS.inProgress) ?? false;

type LoadingStatus = 'inactive' | 'active' | 'finished' | 'error';

interface DeletionStateProps {
  isDeleting: boolean;
  deletionInProgress: boolean;
  showFinished: boolean;
}

export function getDeletionStatus({ isDeleting, deletionInProgress, showFinished }: DeletionStateProps): {
  loadingStatus: LoadingStatus;
  loadingDescription: string;
} {
  if (isDeleting) {
    return {
      loadingStatus: 'active',
      loadingDescription: literals.requesting
    };
  }

  if (showFinished) {
    return {
      loadingStatus: 'finished',
      loadingDescription: literals.deletionStarted
    };
  }

  if (deletionInProgress) {
    return {
      loadingStatus: 'active',
      loadingDescription: literals.deletionAlreadyRunning
    };
  }

  return {
    loadingStatus: 'inactive',
    loadingDescription: ''
  };
}

function createMomentFromDateTime(baseDate: Date, timeString: string): Date | null {
  if (!isValid(baseDate)) {
    return null;
  }

  const [hourStr, minuteStr] = timeString.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  let combinedMoment = setHours(baseDate, hour);
  combinedMoment = setMinutes(combinedMoment, minute);

  if (!isValid(combinedMoment)) {
    return null;
  }

  return combinedMoment;
}

export function timeConfigFromTimeRange({
  startDate,
  startTime,
  endDate,
  endTime
}: InputValues): Pick<TimeConfig, 'to' | 'windowSize'> | null {
  const startMoment = createMomentFromDateTime(startDate, startTime);
  const endMoment = createMomentFromDateTime(endDate, endTime);

  const windowSize = differenceInMilliseconds(endMoment as Date, startMoment as Date);

  if (endMoment && startMoment) {
    return {
      to: endMoment.getTime(),
      windowSize: windowSize
    };
  }
  return null;
}

export function getTimeRangeValidationMessage({ startDate, startTime, endDate, endTime }: InputValues) {
  const startMoment = createMomentFromDateTime(startDate, startTime);
  const endMoment = createMomentFromDateTime(endDate, endTime);
  const now = new Date();

  if (isSameSecond(startMoment as Date, endMoment as Date)) {
    return modalLocalisationStrings.invalidTimeRangeSameMoment;
  }

  if (startMoment && endMoment && isAfter(startMoment, endMoment)) {
    return modalLocalisationStrings.invalidTimeRange;
  }

  if ((startMoment && isAfter(startMoment, now)) || (endMoment && isAfter(endMoment, now))) {
    return modalLocalisationStrings.invalidTimeRangeFuture;
  }

  return null;
}

export function getTagFilterExpressionValidationMessage(inputValues: InputValues) {
  const { tagFilterExpression } = inputValues;

  if (tagFilterExpression.filter(element => element.type === 'TAG_FILTER').length > 5) {
    return modalLocalisationStrings.filterLimitReached;
  }

  return null;
}
