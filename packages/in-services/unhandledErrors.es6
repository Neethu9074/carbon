import { setUnhandledErrorHandler } from 'reactive-observables';
import { createLogger } from 'instalog';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { isInstanaEngineer } from 'in-stores/user';
import { config } from 'in-services/config';
import { ineum } from 'in-services/eum';

const unhandledLogger = createLogger('in-services/unhandledErrors');

export function init() {
  setUnhandledErrorHandler(e => {
    ineum('reportError', e);

    unhandledLogger.error(`Unhandled error in observable chain: ${e.message}`, e);

    if (isInstanaEngineer && !(config.tenant === 'instana' && config.tenantUnit === 'current')) {
      showUnhandledErrorMessage(e);
    }
  });

  window.addEventListener('error', onUnhandledError, false);
}

function onUnhandledError(e) {
  // violation of SOP - we cannot read the error…
  if (e.message === 'Script error.') {
    // Nothing we can do with this information in the ui-tracker logs
    return;
  } else {
    unhandledLogger.error(`Unhandled error: ${e.message} at ${e.filename}:${e.lineno}`, e.error);
  }

  if (isInstanaEngineer) {
    showUnhandledErrorMessage(e);
  }
}

function showUnhandledErrorMessage(e) {
  // decouple from any existing pending React updates to ensure that
  // this message makes it to the user.
  setTimeout(() => {
    addMessage(
      {
        type: 'error',
        title: 'This message is only visible for Instana engineers!',
        content: `An unhandled error occured. Please report this error and how you produced it. Error message: ${
          e.message
        }`
      },
      'unhandled-error'
    );
  }, 0);
}
