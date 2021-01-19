/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getLandingPage, getLandingPage$ } from 'in-client/js/LandingPage/persistence';
import supportedLandingPages from 'in-client/js/LandingPage/supportedLandingPages';

export function getActiveConfiguration() {
  return resolveLandingPage(getLandingPage() || getFirstDefaultPageKey());
}

export function getActiveConfiguration$() {
  return getLandingPage$().map(pageKey => resolveLandingPage(pageKey || getFirstDefaultPageKey()));
}

function getFirstDefaultPageKey() {
  for (let i = 0; i < supportedLandingPages.length; i++) {
    const supportedLandingPage = supportedLandingPages[i];
    if (supportedLandingPage.defaultPageKey) {
      return supportedLandingPage.defaultPageKey;
    }
  }

  throw new Error('This should never happen.');
}

function resolveLandingPage(pageKey) {
  for (let i = 0; i < supportedLandingPages.length; i++) {
    const supportedLandingPage = supportedLandingPages[i];
    if (pageKey.startsWith(supportedLandingPage.persistencePrefix)) {
      return {
        pageKey,
        resolve: supportedLandingPage.resolve
      };
    }
  }

  // Getting here means that the user as an unsupported configuration persisted.
  // Try to recover with the default page key.
  return resolveLandingPage(getFirstDefaultPageKey());
}
