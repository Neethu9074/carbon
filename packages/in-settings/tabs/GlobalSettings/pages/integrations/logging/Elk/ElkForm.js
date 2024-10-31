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

import locals from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Elk/ElkForm.mless';

export default function ElkForm({ form, onChange, disabled }) {
  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="elk-url" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.elkInstance')}
          </Label>
          <Input
            id="elk-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!field.value && field.touched}
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
          <Label htmlFor="elk-basePath" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.basePath')}
          </Label>
          <Input
            id="elk-basePath"
            value={field.value}
            onChange={e => onChange('basePath', e.target.value)}
            hasError={!field.value && field.touched}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.optionalBasePathYouHaveConfiguredInElk" />
          </HelpText>
        </FormGroup>
      ))}

      {form.get('dashboard').map(field => (
        <FormGroup>
          <Label htmlFor="elk-dashboard" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.dashboardId')}
          </Label>
          <Input
            id="elk-dashboard"
            value={field.value}
            onChange={e => onChange('dashboard', e.target.value)}
            hasError={!field.value && field.touched}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.idOfTheDashboardYouHaveConfiguredInElkForInstana" />
          </HelpText>
        </FormGroup>
      ))}
    </fieldset>
  );
}
