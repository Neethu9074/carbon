import React from 'react';

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/Elk/ElkForm.mless';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function ElkForm({ form, onChange, disabled, areFieldsBlank }) {
  const elkUrl = form.get('url').value + '/' + form.get('repository').value;

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
            Example: <b>https://cloud.kibana.com</b> or <b>http://192.168.1.128:443</b> for an internal instance.
          </HelpText>
        </FormGroup>
      ))}

      {form.get('repository').map(field => (
        <FormGroup>
          <Label htmlFor="elk-repository" hasError={!disabled && !field.valid && field.touched}>
            View or repository
          </Label>
          <Input
            id="elk-repository"
            value={field.value}
            onChange={e => onChange('repository', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            Example: the view or repo name you have configured in ELK for Instana.
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
