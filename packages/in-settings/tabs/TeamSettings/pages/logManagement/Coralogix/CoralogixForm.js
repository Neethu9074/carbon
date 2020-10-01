import React from 'react';

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/Humio/HumioForm.mless';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function CoralogixForm({ form, onChange, disabled, areFieldsBlank }) {
  const coralogixUrl = form.get('url').value + '/#/dashboard';

  return (
    <fieldset>
      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="coralogix-url" hasError={!disabled && !field.valid && field.touched}>
            Coralogix Instance
          </Label>
          <Input
            id="coralogix-url"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            Example: <b>https://team.coralogix.com</b> or <b>http://192.168.1.128:443</b> for an internal instance.
          </HelpText>
        </FormGroup>
      ))}

      {!areFieldsBlank && (
        <FormGroup>
          <Label htmlFor="coralogix-test-link">Test your Coralogix link</Label>
          <a href={coralogixUrl} target={'_blank'} rel="noopener noreferrer">
            {coralogixUrl}
          </a>
        </FormGroup>
      )}
    </fieldset>
  );
}
