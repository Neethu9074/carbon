import { get } from 'lodash';

export default function calculateReadyContainers(pod) {
  const containerStatuses = get(pod, ['status', 'containerStatuses'], []);
  const readyContainers = containerStatuses.filter(c => c.ready);
  return `${readyContainers.length} / ${containerStatuses.length}`;
}
