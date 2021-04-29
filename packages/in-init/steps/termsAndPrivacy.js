/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { just, create } from '@instana/observables';
import { createLogger } from '@instana/logger';
import '@instana/components/esm/index.css';
import ReactDOM from 'react-dom';
import React from 'react';

import { saveTosPrivacyAgreement } from 'in-settings/api/saveTosPrivacyAgreement';
import { fullTermsConfigEnabled } from 'in-services/featureFlags';
import TermsDialog from 'in-settings/terms/dialog/TermsDialog';
import ErrorBoundary from 'in-components/ErrorBoundary';

import 'in-themes/foundation.less';

export function init() {
  const accepted = window.instana.termsAndPrivacyAccepted;
  if (accepted) {
    return just(true);
  }

  ReactDOM.render(
    <ErrorBoundary name="terms-and-privacy-dialog">
      <TermsDialog onSave={onSave} fullTermsConfigEnabled={fullTermsConfigEnabled} />
    </ErrorBoundary>,
    document.getElementById('main')
  );

  // Force stop the UI init process at this step. The TermsDialog will
  // force a page reload once completed.
  return create();
}

function onSave(tosPrivacyAgreement, setIsError) {
  saveTosPrivacyAgreement(tosPrivacyAgreement).once(
    response => response.status === 204 && window.location.reload(),
    error => {
      const logger = createLogger('in-init/steps/termsAndPrivacy');
      logger.error(`failed to save TosPrivacyAgreement: ${tosPrivacyAgreement} ${error.message}`, error);
      setIsError(true);
    }
  );
}
