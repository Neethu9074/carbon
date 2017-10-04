import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Step0.less';

const block = 'in-dynamic-rule-dialog-step-0';

export default function Step0({ form, onChange }) {
  return form.get('text').map(field => (
    <Section>
      <FormGroup className={block}>
        <Label htmlFor="rule-event-text" hasError={!field.valid}>
          Rule Title
        </Label>
        <Input
          id="rule-event-text"
          className={`${block}__input`}
          type="text"
          value={field.value}
          onChange={e => onChange('text', e.target.value)}
          hasError={!field.valid}
        />
        {field.messages.map((message, i) => (
          <ValidationBlock hasError key={i}>
            {message.message}
          </ValidationBlock>
        ))}
      </FormGroup>
    </Section>
  ));
}
