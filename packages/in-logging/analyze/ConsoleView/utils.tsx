/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { LogItem, LogTag, TagFilterExpressionElementUnion } from '@instana/types';
import { interval } from '@instana/observables';

import { fillWithParams, MESSAGE_CHUNK, toChunks } from 'in-services/util/stringToChunks';
import { buildJsonSerializer, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { fixateTimeConfig, getTimeConfig, setTimeConfig } from 'in-stores/time/config';
import { LOG_CUSTOM, LOG_LEVEL, LOG_MESSAGE_TIMESTAMP } from 'in-logging/queryBuilder';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { compareIgnoreCase } from 'in-services/util/string';
import getLogs from 'in-logging/subscriptions/getLogs';
import { logsPath } from 'in-logging/navigation/paths';

export const POLLING_INTERVAL_MS = 1000;
export const LINE_HEIGHT = 20;

const RETRIEVAL_SIZE = 200;
const POLLING_DELAY_MS = 30000;
export const getLogsOnIntervalObservable = (filters: TagFilterExpressionElementUnion) =>
  interval(POLLING_INTERVAL_MS)
    .map(timestamp => ({
      timeConfig: {
        windowSize: POLLING_INTERVAL_MS,
        to: timestamp - POLLING_DELAY_MS,
        focusedMoment: timestamp - POLLING_DELAY_MS,
        autoRefresh: false
      },
      tagFilterExpression: filters,
      retrievalSize: RETRIEVAL_SIZE,
      requestedTags: [LOG_LEVEL, LOG_MESSAGE_TIMESTAMP, LOG_CUSTOM]
    }))
    .flatMap(params => getLogs(params))
    .scan((items: LogItem[] = [], result) => [...items, ...(result.data?.items ?? [])]);

function toAbsoluteUrl(partialUrl: string) {
  return new URL(partialUrl, window.location.origin);
}

export function useAbsoluteUrlToItem(itemId: string): URL {
  const { location, createHref } = useNavigation();

  const locationFromLogs = {
    ...location,
    matrix: {
      ...location.matrix,
      '/logs': {
        ...location.matrix['/logs'],
        dataSource: 'logs'
      }
    }
  };

  const timeConfig = getTimeConfig(locationFromLogs);
  setTimeConfig(
    locationFromLogs,
    fixateTimeConfig({
      windowSize: timeConfig.windowSize,
      focusedMoment: timeConfig.focusedMoment,
      autoRefresh: timeConfig.autoRefresh,
      to: timeConfig.to
    })
  );

  setOrDeleteMatrixKey(locationFromLogs, logsPath, 'selectedId', buildJsonSerializer()(itemId));

  return toAbsoluteUrl(createHref(locationFromLogs));
}

export function getLogMessageWithParams(log: LogItem) {
  const paramTags = log.tags
    .filter(({ key }) => key && key.indexOf('_msg_param') === 0)
    .sort((paramA, paramB) => compareIgnoreCase(paramA.key || '', paramB.key || ''));

  const messageStringWithParams = fillWithParams(toChunks(log.message, ['{}']), paramTags)
    .map(({ type, value }) => {
      return type === MESSAGE_CHUNK ? value : (value as LogTag).stringValue;
    })
    .join('');

  return messageStringWithParams;
}
