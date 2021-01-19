/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/Humio/HumioForm.mless';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function HumioForm({ form, onChange, disabled, areFieldsBlank }) {
  const humioUrl = form.get('url').value + '/' + form.get('repository').value;

  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="humio-url" hasError={!disabled && !field.valid && field.touched}>
            Humio Instance
          </Label>
          <Input
            id="humio-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            Example: <b>https://cloud.humio.com</b> or <b>http://192.168.1.128:443</b> for an internal instance.
          </HelpText>
        </FormGroup>
      ))}

      {form.get('repository').map(field => (
        <FormGroup>
          <Label htmlFor="humio-repository" hasError={!disabled && !field.valid && field.touched}>
            View or repository
          </Label>
          <Input
            id="humio-repository"
            value={field.value}
            onChange={e => onChange('repository', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            Example: the view or repo name you have configured in Humio for Instana.
          </HelpText>
        </FormGroup>
      ))}

      {!areFieldsBlank && (
        <FormGroup>
          <Label htmlFor="humio-test-link">Test your Humio link</Label>
          <a href={humioUrl} target={'_blank'} rel="noopener noreferrer">
            {humioUrl}
          </a>
        </FormGroup>
      )}
    </fieldset>
  );
}
