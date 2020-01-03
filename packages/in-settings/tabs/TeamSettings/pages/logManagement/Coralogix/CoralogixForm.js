import React from 'react';

import locals from 'in-settings/tabs/TeamSettings/pages/logManagement/Humio/HumioForm.mless';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function CoralogixForm({ form, onChange, disabled, areFieldsBlank }) {
  const coralogixUrl = 'https://' + form.get('team').value + '.coralogix.com/#/dashboard';

  return (
    <fieldset>
      {form.get('team').map(field => (
        <FormGroup>
          <Label htmlFor="coralogix-team" hasError={!disabled && !field.valid && field.touched}>
            Coralogix Team
          </Label>
          <Input
            id="coralogix-team"
            value={field.value}
            onChange={e => onChange('team', e.target.value)}
            hasError={!disabled && !field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          {!disabled && <TouchedMessages field={field} />}
          <HelpText className={locals.subTextFormField}>
            Your team, visible for example in the URL <b>https://team.coralogix.com/</b>.
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
