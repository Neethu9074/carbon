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

import locals from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/FalconLogScale/FalconLogScaleForm.mless';

export default function FalconLogScaleForm({ form, onChange, disabled, areFieldsBlank, id }) {
  const falconLogScaleUrl = form.get('url').value + '/' + form.get('repository').value;
  return (
    <fieldset id={id} aria-label={id}>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="falconLogScale-url" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.falconLogScaleInstance')}
          </Label>
          <Input
            id="falconLogScale-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!field.value && field.touched}
            autoFocus
            placeholder={t('in-settings:tabs.falconLogScaleUrlPlaceHolder')}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.falconLogScaleExampleForAnInternalInstance" />
          </HelpText>
        </FormGroup>
      ))}

      {form.get('repository').map(field => (
        <FormGroup>
          <Label htmlFor="falconLogScale-repository" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.viewOrRepository')}
          </Label>
          <Input
            id="falconLogScale-repository"
            value={field.value}
            onChange={e => onChange('repository', e.target.value)}
            hasError={!field.value && field.touched}
            placeholder={t('in-settings:tabs.falconLogScaleRepositoryPlaceHolder')}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            {t('in-settings:tabs.exampleTheViewOrRepoNameYouHaveConfiguredInFalconLogScaleForInstana')}
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
                href="https://www.ibm.com/docs/en/instana-observability/latest?topic=logging-humio"
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
                  values={{ integration: 'Falcon Logscale' }}
                  components={{
                    documentationLink: (
                      <Link style={{ 'text-decoration': 'underline' }} size="md" href={falconLogScaleUrl} external />
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
