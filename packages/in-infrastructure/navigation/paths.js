import { navigationParameters$ } from 'in-stores/navigation/navigation';

export const infraExplorePath = '/explore';

export function isInfraExploreView() {
  return navigationParameters$.map(location => location.pathname.indexOf(infraExplorePath) === 0);
}
