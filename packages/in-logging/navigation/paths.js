import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const logsPath = '/logs';

export const analyzePath = '/analyze';
export const analyzePathFullyQualified = `${logsPath}${analyzePath}`;

export function getLinkToAnalyze() {
  return getModifiedUrlStream(location => {
    location.pathname = analyzePathFullyQualified;

    setOrDeleteMatrixKey(location, analyzePath, 'dataSource', 'logs');
    setOrDeleteMatrixKey(location, analyzePath, 'tagFilterExpression', null);
    setOrDeleteMatrixKey(location, analyzePath, 'detailId', null);
    setOrDeleteMatrixKey(location, analyzePath, 'groupBy', null);
    setOrDeleteMatrixKey(location, analyzePath, 'orderBy', null);
    setOrDeleteMatrixKey(location, analyzePath, 'metrics', null);
  });
}

export const isAnalyzeView = navigationParameters$.map(
  location => location.pathname.indexOf(analyzePathFullyQualified) === 0
);
