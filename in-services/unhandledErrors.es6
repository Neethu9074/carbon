import logging from 'instalog';
import React from 'react';

import {addMessage} from 'in-components/MessageFlyout/stores/messages';
import {isInstanaEmployee} from 'in-stores/user';

const unhandledLogger = logging.createLogger('in-services/unhandledErrors');

export function init() {
  window.addEventListener('error', (e) => {
    // violation of SOP - we cannot read the error…
    if (e.message === 'Script error.') {
      unhandledLogger.error('Unhandled error which we cannot read due to SOP');
    } else {
      unhandledLogger.error(`Unhandled error: ${e.message} at ${e.filename}:${e.lineno}`, e.error);
    }

    if (isInstanaEmployee()) {
      showUnhandledErrorMessage(e);
    }

    // let the default error handler run as well
    return false;
  }, false);
}

function showUnhandledErrorMessage(e) {
  // decouple from any existing pending React updates to ensure that
  // this message makes it to the user.
  setTimeout(() => {
    addMessage({
      type: 'error',
      icon: 'error',
      content: (
        <p>
          An unhandled error occured. Please report this error and how you produced it. Error message: {e.message}
        </p>
      )
    });
  }, 0);
}
