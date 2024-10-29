/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { constructLink } from 'in-integrations/logging/mezmo/LinkConstruction';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, Trans } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Mezmo/MezmoForm.mless';

export default function IbmCloudLogMezmoForm({ form, onChange, disabled, areFieldsInvalid }) {
  let accountId = form.get('accountId').value;
  let instanceType = 'IBM_CLOUD';
  let ibmCloudBaseURL = form.get('baseUrl').value;
  const mezmoUrl = constructLink({}, instanceType, accountId, ibmCloudBaseURL);

  return (
    <fieldset>
      {form.get('baseUrl').map(field => (
        <FormGroup>
          <Label htmlFor="mezmo-ibm-cloud-base-url" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.mezmoIbmCloudBaseURL')}
          </Label>
          <Input
            id="mezmo-ibm-cloud-base-url"
            value={field.value}
            onChange={e => onChange('baseUrl', e.target.value)}
            hasError={!field.value && field.touched}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.canBeFoundFromTheIbmCloudUrl" />
          </HelpText>
        </FormGroup>
      ))}
      {form.get('accountId').map(field => (
        <FormGroup>
          <Label htmlFor="mezmo-ibm-cloud-id" hasError={!field.value && field.touched}>
            {t('in-settings:tabs.mezmoIbmCloudId')}
          </Label>
          <Input
            id="mezmo-ibm-cloud-id"
            value={field.value}
            onChange={e => onChange('accountId', e.target.value)}
            hasError={!field.value && field.touched}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.enterIbmCloudAccountId" />
          </HelpText>
        </FormGroup>
      ))}
      {
        <DescriptionText>
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
        </DescriptionText>
      }
      {!areFieldsInvalid && (
        <FormGroup>
          <Label htmlFor="mezmo-test-link">{t('in-settings:tabs.testYourMezmoLink')}</Label>
          <Link size="sm" href={mezmoUrl} external>
            {mezmoUrl}
          </Link>
        </FormGroup>
      )}
    </fieldset>
  );
}
