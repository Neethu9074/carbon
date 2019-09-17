import { just, create } from 'reactive-observables';
import ReactDOM from 'react-dom';
import React from 'react';

import ErrorBoundary from 'in-components/ErrorBoundary/ErrorBoundary';
import TermsDialog from 'in-settings/terms/dialog/TermsDialog';

export function init() {
  const accepted = window.instana.termsAndPrivacyAccepted;
  if (accepted) {
    return just(true);
  }

  ReactDOM.render(
    <ErrorBoundary name="terms-and-privacy-dialog">
      <TermsDialog />
    </ErrorBoundary>,
    document.getElementById('main')
  );

  // Force stop the UI init process at this step. The TermsDialog will
  // force a page reload once completed.
  return create();
}
