import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const logsPath = '/logs';

export const analyzePath = '/analyzeLogs';
export const analyzePathFullyQualified = `${logsPath}${analyzePath}`;

export function getLinkToAnalyze() {
  return getModifiedUrlStream(location => {
    location.pathname = analyzePathFullyQualified;

    setOrDeleteMatrixKey(location, analyzePath, 'logs', 'logs');
    setOrDeleteMatrixKey(location, analyzePath, 'tagFilterExpression', null);
    setOrDeleteMatrixKey(location, analyzePath, 'logId', null);
    setOrDeleteMatrixKey(location, analyzePath, 'groupBy', null);
    setOrDeleteMatrixKey(location, analyzePath, 'orderBy', null);
  });
}

export const isAnalyzeView = navigationParameters$.map(
  location => location.pathname.indexOf(analyzePathFullyQualified) === 0
);
