import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const logsPath = '/logs';
export const rawLogsPath = '/rawlogs';

export function getLinkToAnalyze() {
  return getModifiedUrlStream(location => {
    location.pathname = logsPath;

    setOrDeleteMatrixKey(location, logsPath, 'dataSource', 'logs');
    setOrDeleteMatrixKey(location, logsPath, 'tagFilterExpression', null);
    setOrDeleteMatrixKey(location, logsPath, 'detailId', null);
    setOrDeleteMatrixKey(location, logsPath, 'groupBy', null);
    setOrDeleteMatrixKey(location, logsPath, 'orderBy', null);
    setOrDeleteMatrixKey(location, logsPath, 'metrics', null);
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
