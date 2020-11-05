import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { dataSource as dataSourceMatrixParameter } from 'in-logging/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const logsPath = '/logs';

export const analyzePath = '/analyzeLogs';
export const analyzePathFullyQualified = `${logsPath}${analyzePath}`;

export function getLinkToAnalyze() {
  return getModifiedUrlStream(params => {
    params.pathname = analyzePathFullyQualified;

    setOrDeleteMatrixKey(params, analyzePath, dataSourceMatrixParameter, 'logs');
  });
}

export const isAnalyzeView = navigationParameters$.map(
  location => location.pathname.indexOf(analyzePathFullyQualified) === 0
);
