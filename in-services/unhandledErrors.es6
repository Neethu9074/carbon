import {setUnhandledErrorHandler} from 'reactive-observables';
import logging from 'instalog';
import React from 'react';

import {addMessage} from 'in-components/MessageFlyout/stores/messages';
import {isInstanaEmployee} from 'in-stores/user';

const unhandledLogger = logging.createLogger('in-services/unhandledErrors');

export function init() {
  setUnhandledErrorHandler(e => {
    unhandledLogger.error(`Unhandled error in observable chain: ${e.message}`, e);

    if (isInstanaEmployee()) {
      showUnhandledErrorMessage(e);
    }
  });

  const previousOnErrorHandler = window.onerror || (() => {});
  window.onerror = function onerror(message, filename, lineno, col, error) {
    onUnhandledError({
      message,
      filename,
      lineno,
      error
    });
    if (previousOnErrorHandler) {
      previousOnErrorHandler.apply(this, arguments);
    }
  };
}


function onUnhandledError(e) {
  // violation of SOP - we cannot read the error…
  if (e.message === 'Script error.') {
    unhandledLogger.error('Unhandled error which we cannot read due to SOP');
  } else {
    unhandledLogger.error(`Unhandled error: ${e.message} at ${e.filename}:${e.lineno}`, e.error);
  }

  if (isInstanaEmployee()) {
    showUnhandledErrorMessage(e);
  }
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
    }, 'unhandled-error');
  }, 0);
}
