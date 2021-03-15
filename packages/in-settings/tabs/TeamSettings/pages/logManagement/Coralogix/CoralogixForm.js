/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, Trans } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/Humio/HumioForm.mless';

export default function CoralogixForm({ form, onChange, disabled, areFieldsBlank }) {
  const coralogixUrl = form.get('url').value + '/#/dashboard';

  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="coralogix-url" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.coralogixInstance')}
          </Label>
          <Input
            id="coralogix-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.coralogixExampleForAnInternalInstance" />
          </HelpText>
        </FormGroup>
      ))}

      {!areFieldsBlank && (
        <FormGroup>
          <Label htmlFor="coralogix-test-link">{t('in-settings:tabs.testYourCoralogixLink')}</Label>
          <a href={coralogixUrl} target={'_blank'} rel="noopener noreferrer">
            {coralogixUrl}
          </a>
        </FormGroup>
      )}
    </fieldset>
  );
}
