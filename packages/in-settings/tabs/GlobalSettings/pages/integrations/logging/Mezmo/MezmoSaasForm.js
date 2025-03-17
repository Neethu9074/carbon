/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link, Message } from '@instana/components';

import { constructLink } from 'in-integrations/logging/mezmo/LinkConstruction';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, Trans } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Mezmo/MezmoForm.mless';

export default function MezmoSaasForm({ form, onChange, disabled, areFieldsInvalid, id }) {
  let accountId = form.get('accountId').value;
  let instanceType = 'LOG_DNA_SAAS';
  let mezmoBaseURL = form.get('baseUrl').value;
  const mezmoUrl = constructLink({}, instanceType, accountId, mezmoBaseURL);

  return (
    <fieldset id={id} aria-label={id}>
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
            placeholder={t('in-settings:tabs.mezmoBaseUrlPlaceholder')}
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
            placeholder={t('in-settings:tabs.mezmoAccountIdPlaceholder')}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.enterMezmoAccountId" />
          </HelpText>
        </FormGroup>
      ))}
      <div style={{ padding: '0.75rem 0' }}>
        <Trans
          i18nKey={'in-settings:tabs.integrationDocumentationHelperText'}
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
      {!areFieldsInvalid && (
        <div style={{ padding: '1rem 0' }}>
          <Message
            type="neutral"
            description={
              <div>
                <Trans
                  i18nKey={'in-settings:tabs.mezmoAndSplunkDashboardHelperText'}
                  values={{ integration: 'Mezmo' }}
                  components={{
                    documentationLink: (
                      <Link style={{ 'text-decoration': 'underline' }} size="md" href={mezmoUrl} external />
                    )
                  }}
                />
              </div>
            }
            dismissible
          />
        </div>
      )}
    </fieldset>
  );
}
