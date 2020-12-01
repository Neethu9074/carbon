import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const logsPath = '/logs';

export function getLinkToAnalyze() {
  return getModifiedUrlStream(location => {
    location.pathname = logsPath;

    setOrDeleteMatrixKey(location, logsPath, 'dataSource', 'logs');
    setOrDeleteMatrixKey(location, logsPath, 'tagFilterExpression', null);
    setOrDeleteMatrixKey(location, logsPath, 'logId', null);
    setOrDeleteMatrixKey(location, logsPath, 'groupBy', null);
    setOrDeleteMatrixKey(location, logsPath, 'orderBy', null);
  });
}

export const isAnalyzeView = navigationParameters$.map(location => location.pathname.indexOf(logsPath) === 0);
