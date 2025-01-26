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

import locals from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Coralogix/Coralogix.mless';

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
            placeholder={t('in-settings:tabs.coralogixExampleForAnInternalInstance')}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.coralogixInputHelperText" />
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
                href="https://www.ibm.com/docs/en/instana-observability/current?topic=logging-coralogix"
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
                  i18nKey={'in-settings:tabs.integrationDashboardHelperText'}
                  values={{ integration: 'Coralogix' }}
                  components={{
                    documentationLink: (
                      <Link style={{ 'text-decoration': 'underline' }} size="md" href={coralogixUrl} external />
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
