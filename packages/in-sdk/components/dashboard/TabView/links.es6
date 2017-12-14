import { getActiveView } from 'in-stores/navigation/paths/mainPaths';
import { getModifiedUrlStream } from 'in-stores/navigation';

export function getSubDashboardLink(subViewPath) {
  return getModifiedUrlStream(params => {
    const view = getActiveView(params);
    params.pathname = `/${view}/dashboard${subViewPath}`;
  });
}
