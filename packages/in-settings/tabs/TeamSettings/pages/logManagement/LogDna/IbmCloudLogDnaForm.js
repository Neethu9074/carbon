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

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/LogDna/LogDnaForm.mless';

const ibmCloudBasePath = 'https://cloud.ibm.com/observe/embedded-view/logging/';

export default function IbmCloudLogDnaForm({ form, onChange, disabled, areFieldsInvalid }) {
  const accountId = form.get('accountId').value;
  const logdnaUrl = ibmCloudBasePath + accountId;

  return (
    <fieldset>
      {form.get('accountId').map(field => (
        <FormGroup>
          <Label htmlFor="logdna-ibm-cloud-id" hasError={!disabled && !field.valid && field.touched}>
            {t('in-settings:tabs.logDnaIbmCloudId')}
          </Label>
          <Input
            id="logdna-ibm-cloud-id"
            value={field.value}
            onChange={e => onChange('accountId', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            <Trans i18nKey="in-settings:tabs.canBeFoundFromTheIbmCloudUrl" />
          </HelpText>
        </FormGroup>
      ))}
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
