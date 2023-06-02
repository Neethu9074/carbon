/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/legacy';

import { constructLink } from 'in-integrations/logging/logdna/LinkConstruction';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, Trans } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/LogDna/LogDnaForm.mless';

export default function LogDnaSaasForm({ form, onChange, disabled, areFieldsInvalid }) {
  let accountId = form.get('accountId').value;
  let instanceType = 'LOG_DNA_SAAS';
  let logDnaBaseURL = form.get('baseUrl').value;
  const logdnaUrl = constructLink({}, instanceType, accountId, logDnaBaseURL);

  return (
    <fieldset>
      {form.get('baseUrl').map(field => (
        <FormGroup>
          <Label htmlFor="logdna-base-url" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.logDnaBaseURL')}
          </Label>
          <Input
            id="logdna-base-url"
            value={field.value}
            onChange={e => onChange('baseUrl', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.canBeFoundFromTheLogdnaUrl" />
          </HelpText>
        </FormGroup>
      ))}
      {form.get('accountId').map(field => (
        <FormGroup>
          <Label htmlFor="logdna-account-id" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.logDnaAccountId')}
          </Label>
          <Input
            id="logdna-account-id"
            value={field.value}
            onChange={e => onChange('accountId', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.enterLogDnaAccountId" />
          </HelpText>
        </FormGroup>
      ))}
      {
        <DescriptionText>
          <Trans
            i18nKey={'in-settings:tabs.logDnaDocumentationReference'}
            components={{
              documentationLink: <Link href="https://www.ibm.com/docs/en/obi/current?topic=logging-logdna" external />
            }}
          />
        </DescriptionText>
      }
      {!areFieldsInvalid && (
        <FormGroup>
          <Label htmlFor="logdna-test-link">{t('in-settings:tabs.testYourLogDnaLink')}</Label>
          <a href={logdnaUrl} target={'_blank'} rel="noopener noreferrer">
            {logdnaUrl}
          </a>
        </FormGroup>
      )}
    </fieldset>
  );
}
