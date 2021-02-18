/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import Button from 'in-new-components/Button';

export function DataProtectionMailButton({ fontSize }) {
  return (
    <Button
      style={{ padding: 0, margin: 0, fontSize }}
      kind="action"
      target="_blank"
      href="mailto:dataprotection@instana.com"
    >
      {t('in-settings:termsDialog.dataProtectionMail')}
    </Button>
  );
}

export function CookiePolicyButton({ label, fontSize }) {
  return (
    <Button
      style={{ padding: 0, margin: 0, fontSize }}
      kind="action"
      target="_blank"
      href="https://www.instana.com/cookie-policy"
    >
      {label ? label : t('in-settings:termsDialog.cookiePolicy')}
    </Button>
  );
}

export function TosButton({ withIcon, label, fontSize }) {
  return (
    <Button
      style={{ padding: 0, margin: 0, fontSize }}
      kind="action"
      icon={withIcon ? 'lib_views_external_link' : ''}
      target="_blank"
      href="https://instana.com/docs/instana-terms-latest.pdf"
    >
      {label ? label : t('in-settings:termsDialog.termsOfService')}
    </Button>
  );
}

export function PrivacyButton({ withIcon, label, fontSize }) {
  return (
    <Button
      style={{ padding: 0, margin: 0, fontSize }}
      kind="action"
      icon={withIcon ? 'lib_views_external_link' : ''}
      target="_blank"
      href="https://instana.com/docs/instana-privacy-policy-latest.pdf"
      noAutoMargin
    >
      {label ? label : t('in-settings:termsDialog.privacyProductPolicy')}
    </Button>
  );
}
