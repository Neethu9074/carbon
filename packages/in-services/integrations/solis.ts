/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable, Subject, create } from '@instana/observables';
import { solisEnabled } from 'in-services/featureFlags';

/**
 * Modify the given url depending on
 *
 * * solis enabled via feature-flag
 * * current host url
 * * given context
 *
 * For a regular instana installation without solis enabled, it just returns the given url.
 *
 * When solis enabled, it will retain the current host or origin, an adds an options context to the baseurl
 * before adding the rest of the given url's path etc.
 *
 * Example:
 * This link in instana running on e.g. https://unit01-techpreview001.orchid.instana.tools/
 *
 * https://65134.euc1-2.concert.test.saas.ibm.com/#/vulnerability/cves/CVE-2024-5535?instance_id=20250410-1728-2433-60b5-2de9c103568e
 *
 * should be modified with given 'concert' base path to
 *
 * https://unit01-techpreview001.orchid.instana.tools/concert/#/vulnerability/cves/CVE-2024-5535?instance_id=20250410-1728-2433-60b5-2de9c103568e
 */
export function getSolisIntegrationUrl(url: string, context: string): string {
  if (!solisEnabled) {
    return url;
  }
  let urlObj = new URL(url);
  let currentOrigin = window.location.origin;
  return currentOrigin + (context ? '/' + context : '') + urlObj.pathname + urlObj.hash + urlObj.search;
}

/*

Example usage:

startTourTriggered$.subscribe((event  :CustomEvent<string>) => {
// id of clicked tour element as defined in GET /solis/help (see "Server-side integration steps" below for more detail)
// https://github.ibm.com/solis/solis-central/wiki/solis%E2%80%90nav-adoption-guide
const clickedTourElementId = event.detail;
})
*/

export const startTourTriggered$ = onCustomEvent<CustomEvent<string>>('solis:start-tour');


/** extension of the on(...) method in the observables package */
function onCustomEvent<T extends CustomEvent>(
  eventType: string,
  options?: AddEventListenerOptions | boolean
): Observable<T> {
  const observable: Subject<T> = create({ start, stop });
  return observable;

  function listener(e: Event): void {
    if (e.type === eventType && 'detail' in e) {
      observable.emit(e as T);
    }
  }

  function start() {
    window.addEventListener(eventType, listener, options);
  }

  function stop() {
    window.removeEventListener(eventType, listener, options);
  }
}
