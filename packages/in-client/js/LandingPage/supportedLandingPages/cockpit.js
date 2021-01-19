/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { setLandingPage as setLandingPageInPersistence } from 'in-client/js/LandingPage/persistence';
import { cockpit } from 'in-cockpit/navigation/paths';

export const enabled = true;
export const persistencePrefix = 'cockpit';
export const defaultPageKey = persistencePrefix;

export function resolve(location) {
  location.pathname = cockpit;
}

export function setLandingPage() {
  setLandingPageInPersistence(persistencePrefix);
}

export function isLandingPage(pageKey) {
  return pageKey === persistencePrefix;
}
