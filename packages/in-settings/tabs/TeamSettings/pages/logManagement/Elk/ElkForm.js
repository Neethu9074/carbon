/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/Elk/ElkForm.mless';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import { isBlank } from 'in-services/util/string';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function ElkForm({ form, onChange, disabled, areFieldsBlank }) {
  let basePath = form.get('basePath').value;
  basePath = isBlank(basePath) ? '' : '/' + basePath.trim();

  const elkUrl = form.get('url').value + basePath + '/app/kibana#/dashboard/' + form.get('dashboard').value;

  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="elk-url" hasError={!disabled && !field.valid && field.touched}>
            ELK Instance
          </Label>
          <Input
            id="elk-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            Example: <b>http://kibana.com:5601</b> or <b>http://192.168.1.128:5601</b> for an internal instance.
          </HelpText>
        </FormGroup>
      ))}

      {form.get('basePath').map(field => (
        <FormGroup>
          <Label htmlFor="elk-basePath" hasError={!disabled && !field.valid && field.touched}>
            Base Path
          </Label>
          <Input
            id="elk-basePath"
            value={field.value}
            onChange={e => onChange('basePath', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            Example: http://kibana.com:5601/
            <b>instana</b>
            /app/kibana#. Optional base path you have configured in ELK.
          </HelpText>
        </FormGroup>
      ))}

      {form.get('dashboard').map(field => (
        <FormGroup>
          <Label htmlFor="elk-dashboard" hasError={!disabled && !field.valid && field.touched}>
            Dashboard ID
          </Label>
          <Input
            id="elk-dashboard"
            value={field.value}
            onChange={e => onChange('dashboard', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            Example: Can be found from the URL http://kibana.com:5601/app/kibana#/dashboard/
            <b>a23a8810-4ce8-11ea-9be2-a53f95fe8814</b>. ID of the dashboard you have configured in ELK for Instana.
          </HelpText>
        </FormGroup>
      ))}

      {!areFieldsBlank && (
        <FormGroup>
          <Label htmlFor="elk-test-link">Test your ELK link</Label>
          <a href={elkUrl} target={'_blank'} rel="noopener noreferrer">
            {elkUrl}
          </a>
        </FormGroup>
      )}
    </fieldset>
  );
}
