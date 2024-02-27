/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// Fixing the styling of the Toggle on the main pages
//
// to be removed, after Toggle was migrated.
// This loads the styling of react-toggle
import 'react-toggle/style.css';
import ReactDOM from 'react-dom';
import React from 'react';

// ^ needs to be put here, to be bundled before the overriding styles from legacy package
import '@instana/legacy/esm/index.css';
import { ThemeProvider, getThemeOverride } from '@instana/components';
import { just, create } from '@instana/observables';
import { createLogger } from '@instana/logger';
import '@instana/components/esm/index.css';

import { saveTosPrivacyAgreement } from 'in-settings/api/saveTosPrivacyAgreement';
import { fullTermsConfigEnabled } from 'in-services/featureFlags';
import TermsDialog from 'in-settings/terms/dialog/TermsDialog';
import ErrorBoundary from 'in-components/ErrorBoundary';
import GlobalTheme from 'in-themes/GlobalTheme';

import 'in-themes/foundation.less';

export function init() {
  // TODO
  const accepted = window.instana.termsAndPrivacyAccepted;
  if (accepted) {
    return just(true);
  }
  const currentTheme = getThemeOverride() ?? 'default';

  ReactDOM.render(
    <ErrorBoundary name="terms-and-privacy-dialog">
      <GlobalTheme>
        <ThemeProvider theme={currentTheme}>
          <TermsDialog onSave={onSave} fullTermsConfigEnabled={fullTermsConfigEnabled} />
        </ThemeProvider>
      </GlobalTheme>
    </ErrorBoundary>,
    document.getElementById('main')
  );

  // Force stop the UI init process at this step. The TermsDialog will
  // force a page reload once completed.
  return create();
}

function onSave(tosPrivacyAgreement, setIsError) {
  // TODO
  saveTosPrivacyAgreement(tosPrivacyAgreement).once(
    response => response.status === 204 && window.location.reload(),
    error => {
      const logger = createLogger('in-init/steps/termsAndPrivacy');
      logger.error(`failed to save TosPrivacyAgreement: ${tosPrivacyAgreement} ${error.message}`, error);
      setIsError(true);
    }
  );
}
