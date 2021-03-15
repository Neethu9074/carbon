/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import { isBlank } from 'in-services/util/string';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, Trans } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/Elk/ElkForm.mless';

export default function ElkForm({ form, onChange, disabled, areFieldsBlank }) {
  let basePath = form.get('basePath').value;
  basePath = isBlank(basePath) ? '' : '/' + basePath.trim();

  const elkUrl = form.get('url').value + basePath + '/app/kibana#/dashboard/' + form.get('dashboard').value;

  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="elk-url" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.elkInstance')}
          </Label>
          <Input
            id="elk-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.elkExampleForAnInternalInstance" />
          </HelpText>
        </FormGroup>
      ))}

      {form.get('basePath').map(field => (
        <FormGroup>
          <Label htmlFor="elk-basePath" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.basePath')}
          </Label>
          <Input
            id="elk-basePath"
            value={field.value}
            onChange={e => onChange('basePath', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.optionalBasePathYouHaveConfiguredInElk" />
          </HelpText>
        </FormGroup>
      ))}

      {form.get('dashboard').map(field => (
        <FormGroup>
          <Label htmlFor="elk-dashboard" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.dashboardId')}
          </Label>
          <Input
            id="elk-dashboard"
            value={field.value}
            onChange={e => onChange('dashboard', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.idOfTheDashboardYouHaveConfiguredInElkForInstana" />
          </HelpText>
        </FormGroup>
      ))}

      {!areFieldsBlank && (
        <FormGroup>
          <Label htmlFor="elk-test-link">{t('in-settings:tabs.testYourElkLink')}</Label>
          <a href={elkUrl} target={'_blank'} rel="noopener noreferrer">
            {elkUrl}
          </a>
        </FormGroup>
      )}
    </fieldset>
  );
}
