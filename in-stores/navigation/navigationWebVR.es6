import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { mutateUrl } from 'in-stores/navigation/navigation';

export function goToLogicalView() {
  mutateUrl(navParams => {
    navParams.pathname = '/webVR/logical';
    return navParams;
  });
}

export function goToPhysicalView() {
  mutateUrl(navParams => {
    navParams.pathname = '/webVR/physical';
    return navParams;
  });
}

export const isLogicalMapView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/webVR/logical') === 0)
  .distinct();
