import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Step0.less';

const block = 'in-alerting-config-form-step-0';

export default function Step1({ form, onChange }) {
  return (
    <Section>
      {form.get('name').map(field => (
        <FormGroup className={block}>
          <Label htmlFor="name" hasError={!field.valid && field.touched}>
            Name
          </Label>
          <Input
            id="name"
            className={`${block}__input`}
            type="text"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </Section>
  );
}
