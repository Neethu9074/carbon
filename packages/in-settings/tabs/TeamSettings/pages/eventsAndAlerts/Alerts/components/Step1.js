import React from 'react';

import SectionHeading from 'in-settings/components/SectionHeading';
import DescriptionText from 'in-components/form/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default function Step1({ form, onChange }) {
  return form.get('name').map(field => (
    <FormGroup>
      <SectionHeading>1. Name</SectionHeading>
      <Label htmlFor="name" hasError={!field.valid && field.touched}>
        Name
      </Label>
      <Input
        id="name"
        type="text"
        value={field.value}
        maxLength={256}
        onChange={e => onChange('name', e.target.value)}
        hasError={!field.valid}
      />
      <TouchedMessages field={field} />
      <DescriptionText>Shows up in the list of alerts. Should be unique and meaningful.</DescriptionText>
    </FormGroup>
  ));
}
