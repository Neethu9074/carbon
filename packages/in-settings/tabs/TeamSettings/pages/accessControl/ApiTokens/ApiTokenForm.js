import React from 'react';

import Permissions from 'in-settings/tabs/TeamSettings/pages/accessControl/Roles/Permissions';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function ApiTokenForm({ form, onChange, disabled }) {
  return (
    <fieldset disabled={disabled}>
      <SectionHeading>General</SectionHeading>

      {form.get('accessGrantingToken').map(field => (
        <FormGroup>
          <Label htmlFor="api-token-accessGrantingToken">API Token</Label>
          <Input id="api-token-accessGrantingToken" value={field.value} readOnly />
        </FormGroup>
      ))}

      {form.get('name').map(field => (
        <FormGroup>
          <Label htmlFor="api-token-name" hasError={!field.valid && field.touched}>
            Name
          </Label>
          <Input
            id="api-token-name"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      <Permissions form={form} onChange={onChange} disabled={disabled} />
    </fieldset>
  );
}
