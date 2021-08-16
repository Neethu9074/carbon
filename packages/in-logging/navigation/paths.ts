/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { buildJsonSerializer, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { TagFilterExpression, TimeConfig } from 'in-types';
import { setTimeConfig } from 'in-stores/time/config';

export const logsPath = '/logs';
export const rawLogsPath = '/rawlogs';

interface GetLinkToAnalyzeRequest {
  timeConfig: TimeConfig;
  tagFilterExpression?: TagFilterExpression;
}

export function getLinkToAnalyze({ tagFilterExpression, timeConfig }: GetLinkToAnalyzeRequest) {
  return getModifiedUrlStream(location => {
    location.pathname = logsPath;

    setOrDeleteMatrixKey(location, logsPath, 'dataSource', 'logs');
    setOrDeleteMatrixKey(location, logsPath, 'detailId', null);
    setOrDeleteMatrixKey(location, logsPath, 'groupBy', null);
    setOrDeleteMatrixKey(location, logsPath, 'orderBy', null);
    setOrDeleteMatrixKey(location, logsPath, 'metrics', null);

    setOrDeleteMatrixKey(
      location,
      logsPath,
      'tagFilterExpression',
      tagFilterExpression ? buildJsonSerializer()(tagFilterExpression) : tagFilterExpression
    );

    if (timeConfig) {
      setTimeConfig(location, timeConfig);
    }
  });
}

export function getLinkToRawLogs() {
  return getModifiedUrlStream(location => {
    location.pathname = rawLogsPath;

    setOrDeleteMatrixKey(location, rawLogsPath, 'dataSource', 'rawlogs');
  });
}

export const isAnalyzeView = navigationParameters$.map(
  location => location.pathname.indexOf(logsPath) === 0 || location.pathname.indexOf(rawLogsPath) === 0
);
