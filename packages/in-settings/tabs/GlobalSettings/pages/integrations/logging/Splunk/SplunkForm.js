/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link, Message } from '@instana/components';

import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, Trans } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Splunk/SplunkForm.mless';

export default function SplunkForm({ form, onChange, disabled, areFieldsBlank, id }) {
  const splunkUrl = form.get('url').value;

  return (
    <fieldset id={id} aria-label={id}>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="splunk-url" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.splunkInstance')}
          </Label>
          <Input
            id="splunk-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!field.value && field.touched}
            autoFocus
            placeholder={t('in-settings:tabs.splunkBaseUrlPlaceholder')}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.splunkExampleForAnInternalInstance" />
          </HelpText>
        </FormGroup>
      ))}

      {form.get('index').map(field => (
        <FormGroup>
          <Label htmlFor="splunk-index" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.splunkIndexText')}
          </Label>
          <Input
            id="splunk-index"
            value={field.value}
            onChange={e => onChange('index', e.target.value)}
            hasError={!field.value && field.touched}
            placeholder={t('in-settings:tabs.splunkIndexPlaceholder')}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            {t('in-settings:tabs.exampleTheIndexNameYouHaveAddedInSplunk')}
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
                href="https://www.ibm.com/docs/en/instana-observability/current?topic=logging-splunk"
                external
              />
            )
          }}
        />
      </div>
      {!areFieldsBlank && (
        <div style={{ padding: '1rem 0' }}>
          <Message
            type="neutral"
            description={
              <div>
                <Trans
                  i18nKey={'in-settings:tabs.mezmoAndSplunkDashboardHelperText'}
                  values={{ integration: 'Splunk' }}
                  components={{
                    documentationLink: (
                      <Link style={{ 'text-decoration': 'underline' }} size="md" href={splunkUrl} external />
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
