/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonForm, Typography, CarbonTextInput } from '@instana/components';

import { GoogleSsoFormProps } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/GoogleSSO/GoogleSSO.types';
import { t } from 'in-i18n';

function GoogleSSOForm(props: GoogleSsoFormProps) {
  const { form, setForm } = props;
  const allowedDomainsField = form.getIn(['filter']);

  return (
    <CarbonForm>
      <Typography component="p" variant="body-regular">
        {t('in-settings:tabs.googleSSO.preconfiguredGoogleSSOMessage')}
      </Typography>
      <Typography component="p" variant="body-regular">
        {t('in-settings:tabs.googleSSO.domainOnlyMessage')}
      </Typography>
      <CarbonTextInput
        labelText={t('in-settings:tabs.googleSSO.allowedDomains')}
        id="google_sso_filter"
        type="text"
        value={allowedDomainsField.value}
        onChange={e => setForm(form.updateIn(['filter'], f => f.setValue(e.target.value).setTouched(true)))}
        placeholder="@example.com, @example.io"
        autoComplete="off"
        invalid={allowedDomainsField.touched && !allowedDomainsField.valid}
        invalidText={allowedDomainsField.messages[0]?.message}
        helperText={t('in-settings:tabs.googleSSO.hint')}
      />
    </CarbonForm>
  );
}

export default GoogleSSOForm;
