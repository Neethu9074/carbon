import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function Websites({ form, onChange }) {
  return form.get('infraDfqFilter').map(field => (
    <FormGroup>
      <Label htmlFor="permission-set-name" hasError={!field.valid && field.touched}>
        Infrastructure Dynamic Focus Query
      </Label>
      <Input
        id="permission-set-name"
        value={field.value}
        onChange={e => onChange('infraDfqFilter', e.target.value)}
        placeholder={'e.g. entity.zone:"production" AND NOT event.text:"TCP*"'}
      />
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}
