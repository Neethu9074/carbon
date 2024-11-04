/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { constructLink } from 'in-integrations/logging/mezmo/LinkConstruction';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, Trans } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Mezmo/MezmoForm.mless';

export default function MezmoSaasForm({ form, onChange, disabled, areFieldsInvalid }) {
  let accountId = form.get('accountId').value;
  let instanceType = 'LOG_DNA_SAAS';
  let mezmoBaseURL = form.get('baseUrl').value;
  const mezmoUrl = constructLink({}, instanceType, accountId, mezmoBaseURL);

  return (
    <fieldset>
      {form.get('baseUrl').map(field => (
        <FormGroup>
          <Label htmlFor="mezmo-base-url" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.mezmoBaseURL')}
          </Label>
          <Input
            id="mezmo-base-url"
            value={field.value}
            onChange={e => onChange('baseUrl', e.target.value)}
            hasError={!field.value && field.touched}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.canBeFoundFromTheMezmoUrl" />
          </HelpText>
        </FormGroup>
      ))}
      {form.get('accountId').map(field => (
        <FormGroup>
          <Label htmlFor="mezmo-account-id" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.mezmoAccountId')}
          </Label>
          <Input
            id="mezmo-account-id"
            value={field.value}
            onChange={e => onChange('accountId', e.target.value)}
            hasError={!field.value && field.touched}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.enterMezmoAccountId" />
          </HelpText>
        </FormGroup>
      ))}
      {
        <div style={{ padding: '1rem 0' }}>
          <Trans
            i18nKey={'in-settings:tabs.mezmoDocumentationReference'}
            components={{
              documentationLink: (
                <Link
                  size="sm"
                  href="https://www.ibm.com/docs/en/instana-observability/current?topic=logging-mezmo"
                  external
                />
              )
            }}
          />
        </div>
      }
      {!areFieldsInvalid && (
        <FormGroup>
          <Label htmlFor="mezmo-test-link">
            <Trans i18nKey={'in-settings:tabs.testYourMezmoLink'} />
          </Label>
          <Link id="mezmo-test-link" size="sm" href={mezmoUrl} external>
            {mezmoUrl}
          </Link>
        </FormGroup>
      )}
    </fieldset>
  );
}
