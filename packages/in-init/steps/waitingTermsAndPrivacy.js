/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* global require:false */

import { just, create } from '@instana/observables';
import { createLogger } from '@instana/logger';
import ReactDOM from 'react-dom';
import React from 'react';

import FullViewWrapper from 'in-waiting-for-deployment/components/FullViewWrapper';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import ErrorBoundary from 'in-components/ErrorBoundary';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import TermsDialog from 'in-settings/terms/dialog/TermsDialog';
import DialogPresenter from 'in-components/DialogPresenter';
import http from 'in-services/http/http';

require('in-services/security/csrf').init();

export function init() {
  const accepted = window.instana.termsAndPrivacyAccepted;
  const user = window.instana.user;
  if (accepted || !user) {
    // this dialog is nice to have before the onboarding starts to avoid nasty context switches
    // between onboarding while waiting -> ToS -> onboarding while agent install. When we cannot
    // provide the ToS beforehand because we don`t have all the infos we need, it`s okay to skip it
    return just(true);
  }

  const observable = create();

  ReactDOM.render(<App />, document.getElementById('main'));

  // Force stop the UI init process at this step. The TermsDialog will force a page reload once completed.
  return observable;
}

function App() {
  useDisabledBodyScroll();

  return (
    <ErrorBoundary name="terms-and-privacy-dialog">
      <DialogPresenter />

      <FullViewWrapper>
        <TermsDialog onSave={onSave} />
      </FullViewWrapper>
    </ErrorBoundary>
  );
}

function save(data) {
  return http({
    method: 'POST',
    url: `/tos-privacy-agreement/storeUserAcceptance`,
    headers: getCsrfHeader(),
    data,
    maxRetries: 3
  });
}

function onSave(tosPrivacyAgreement, setIsError) {
  save(tosPrivacyAgreement).once(
    response => response.status === 204 && window.location.reload(),
    error => {
      const logger = createLogger('in-init/steps/waitingTermsAndPrivacy');
      logger.error(`failed to save TosPrivacyAgreement: ${tosPrivacyAgreement} ${error.message}`, error);
      setIsError(true);
    }
  );
}
