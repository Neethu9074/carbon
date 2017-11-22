import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Step1.less';

const block = 'in-alerting-config-form-step-1';

export default function Step1({ form, onChange }) {
  return (
    <Section>
      {form.get('name').map(field => (
        <FormGroup className={block}>
          <Label htmlFor="name" hasError={!field.valid}>
            Config Name
          </Label>
          <Input
            id="name"
            className={`${block}__input`}
            type="text"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid}
          />
          {field.messages.map((message, i) => (
            <ValidationBlock hasError key={i}>
              {message.message}
            </ValidationBlock>
          ))}
        </FormGroup>
      ))}
    </Section>
  );
}
