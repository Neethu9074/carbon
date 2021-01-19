/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/Splunk/SplunkForm.mless';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function SplunkForm({ form, onChange, disabled, areFieldsBlank }) {
  const splunkUrl = form.get('url').value;

  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="splunk-url" hasError={!disabled && !field.valid && field.touched}>
            Splunk Instance
          </Label>
          <Input
            id="splunk-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            Example: <b>https://cloud.splunk.com</b> or <b>http://192.168.1.128:443</b> for an internal instance.
          </HelpText>
        </FormGroup>
      ))}

      {form.get('index').map(field => (
        <FormGroup>
          <Label htmlFor="splunk-index" hasError={!disabled && !field.valid && field.touched}>
            Index
          </Label>
          <Input
            id="splunk-index"
            value={field.value}
            onChange={e => onChange('index', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>Example: the index name you have added in Splunk.</HelpText>
        </FormGroup>
      ))}

      {!areFieldsBlank && (
        <FormGroup>
          <Label htmlFor="splunk-test-link">Test your Splunk link</Label>
          <a href={splunkUrl} target={'_blank'} rel="noopener noreferrer">
            {splunkUrl}
          </a>
        </FormGroup>
      )}
    </fieldset>
  );
}
