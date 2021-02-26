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

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/Humio/HumioForm.mless';

export default function HumioForm({ form, onChange, disabled, areFieldsBlank }) {
  const humioUrl = form.get('url').value + '/' + form.get('repository').value;

  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="humio-url" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.humioInstance')}
          </Label>
          <Input
            id="humio-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.humioExampleForAnInternalInstance" />
          </HelpText>
        </FormGroup>
      ))}

      {form.get('repository').map(field => (
        <FormGroup>
          <Label htmlFor="humio-repository" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.viewOrRepository')}
          </Label>
          <Input
            id="humio-repository"
            value={field.value}
            onChange={e => onChange('repository', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            {t('in-settings:tabs.exampleTheViewOrRepoNameYouHaveConfiguredInHumioForInstana')}
          </HelpText>
        </FormGroup>
      ))}

      {!areFieldsBlank && (
        <FormGroup>
          <Label htmlFor="humio-test-link">{t('in-settings:tabs.testYourHumioLink')}</Label>
          <a href={humioUrl} target={'_blank'} rel="noopener noreferrer">
            {humioUrl}
          </a>
        </FormGroup>
      )}
    </fieldset>
  );
}
