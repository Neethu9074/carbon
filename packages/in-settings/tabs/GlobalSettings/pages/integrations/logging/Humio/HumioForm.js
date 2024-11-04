/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, Trans } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Humio/HumioForm.mless';

export default function HumioForm({ form, onChange, disabled, areFieldsBlank }) {
  const humioUrl = form.get('url').value + '/' + form.get('repository').value;

  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="humio-url" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.humioInstance')}
          </Label>
          <Input
            id="humio-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!field.value && field.touched}
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
          <Label htmlFor="humio-repository" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.viewOrRepository')}
          </Label>
          <Input
            id="humio-repository"
            value={field.value}
            onChange={e => onChange('repository', e.target.value)}
            hasError={!field.value && field.touched}
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
          <Link size="sm" href={humioUrl} external>
            {humioUrl}
          </Link>
        </FormGroup>
      )}
    </fieldset>
  );
}
