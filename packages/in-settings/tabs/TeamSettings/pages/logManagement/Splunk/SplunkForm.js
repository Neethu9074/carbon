/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t, Trans } from 'in-i18n';
import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/Splunk/SplunkForm.mless';

export default function SplunkForm({ form, onChange, disabled, areFieldsBlank }) {
  const splunkUrl = form.get('url').value;

  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="splunk-url" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.splunkInstance')}
          </Label>
          <Input
            id="splunk-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.splunkExampleForAnInternalInstance" />
          </HelpText>
        </FormGroup>
      ))}

      {form.get('index').map(field => (
        <FormGroup>
          <Label htmlFor="splunk-index" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.index')}
          </Label>
          <Input
            id="splunk-index"
            value={field.value}
            onChange={e => onChange('index', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            {t('in-settings:tabs.exampleTheIndexNameYouHaveAddedInSplunk')}
          </HelpText>
        </FormGroup>
      ))}

      {!areFieldsBlank && (
        <FormGroup>
          <Label htmlFor="splunk-test-link">{t('in-settings:tabs.testYourSplunkLink')}</Label>
          <a href={splunkUrl} target={'_blank'} rel="noopener noreferrer">
            {splunkUrl}
          </a>
        </FormGroup>
      )}
    </fieldset>
  );
}
