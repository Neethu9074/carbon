/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
      dataprotection@instana.com
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
      {label ? label : 'Cookie Policy'}
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
      {label ? label : 'Terms of Service'}
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
      {label ? label : 'Privacy Product Policy'}
    </Button>
  );
}
