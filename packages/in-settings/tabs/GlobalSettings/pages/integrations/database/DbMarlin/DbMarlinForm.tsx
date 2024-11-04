/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link } from '@instana/components';

import {
  IntegrationForm,
  IntegrationFormPath
} from 'in-settings/tabs/GlobalSettings/pages/integrations/database/types';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import { isBlank } from 'in-services/util/string';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, Trans } from 'in-i18n';

import locals from './DbMarlinForm.mless';

interface DbMarlinFormProps {
  form: IntegrationForm;
  onChange: (fieldName: IntegrationFormPath, value: string | boolean) => void;
  disabled: boolean;
}

export default function DbMarlinForm({ form, onChange, disabled }: DbMarlinFormProps) {
  const dbMarlinUrl = form.get('url').value;
  const isUrlBlank = isBlank(dbMarlinUrl);

  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="dbmarlin-url" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.team.integrations.database.dbMarlinInstance')}
          </Label>
          <Input
            id="dbmarlin-url"
            value={field.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(['url'], e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.team.integrations.database.dbMarlinExampleForAnInternalInstance" />
          </HelpText>
        </FormGroup>
      ))}
      {!isUrlBlank && (
        <FormGroup className={locals.urlTest}>
          <Label>
            <strong>{t('in-settings:tabs.team.integrations.database.testDbMarlinInstance')}</strong>
          </Label>
          <Link size="sm" href={dbMarlinUrl} external>
            {dbMarlinUrl}
          </Link>
        </FormGroup>
      )}
    </fieldset>
  );
}
