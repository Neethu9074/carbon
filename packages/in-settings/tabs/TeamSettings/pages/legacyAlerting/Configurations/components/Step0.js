import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default function Step1({ form, onChange }) {
  return form.get('name').map(field => (
    <FormGroup>
      <Label htmlFor="name" hasError={!field.valid && field.touched}>
        Name
      </Label>
      <Input
        id="name"
        type="text"
        value={field.value}
        onChange={e => onChange('name', e.target.value)}
        hasError={!field.valid}
      />
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}
