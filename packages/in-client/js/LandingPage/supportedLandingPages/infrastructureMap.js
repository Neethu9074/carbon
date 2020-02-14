import { setLandingPage as setLandingPageInPersistence } from 'in-client/js/LandingPage/persistence';
import { physicalPath } from 'in-stores/navigation/paths/mainPaths';

export const enabled = true;
export const persistencePrefix = 'infrastructureMap';
export const defaultPageKey = persistencePrefix;

export function resolve(location) {
  location.pathname = physicalPath;
}

export function setLandingPage() {
  setLandingPageInPersistence(persistencePrefix);
}

export function isLandingPage(pageKey) {
  return pageKey === persistencePrefix;
}
