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

// TODO: use Coralogix css
import locals from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Humio/HumioForm.mless';

export default function CoralogixForm({ form, onChange, disabled, areFieldsBlank }) {
  const coralogixUrl = form.get('url').value + '/#/dashboard';

  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="coralogix-url" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.coralogixInstance')}
          </Label>
          <Input
            id="coralogix-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!field.value && field.touched}
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
          <Label htmlFor="coralogix-test-link">
            <Trans i18nKey="in-settings:tabs.testYourCoralogixLink" />
          </Label>
          <Link size="sm" href={coralogixUrl} external>
            {coralogixUrl}
          </Link>
        </FormGroup>
      )}
    </fieldset>
  );
}
