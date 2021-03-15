/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { setUnhandledErrorHandler } from '@instana/observables';
import { createLogger } from '@instana/logger';
import { get } from 'lodash';

import { ineum } from 'in-services/tracking/ineum';

const unhandledLogger = createLogger('in-services/unhandledErrors');

export function init() {
  setUnhandledErrorHandler(e => {
    const status = get(e, ['response', 'status']);
    if (status === 401 || status === 403) {
      // No need to report unauthorized errors to our error tracking system.
      return;
    }

    ineum('reportError', e);
    unhandledLogger.error(`Unhandled error in observable chain: ${e.message}`, e);
  });

  window.addEventListener('error', onUnhandledError, false);
}

function onUnhandledError(e) {
  // violation of SOP - we cannot read the error…
  if (e.message === 'Script error.') {
    // Nothing we can do with this information in the logs
    return;
  } else {
    unhandledLogger.error(`Unhandled error: ${e.message} at ${e.filename}:${e.lineno}`, e.error);
  }
}
