import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Step0.less';

const block = 'in-dynamic-rule-dialog-step-0';

export default function Step0({ form, onChange }) {
  return form.get('text').map(field => (
    <Section>
      <FormGroup className={block}>
        <Label htmlFor="rule-event-text" hasError={!field.valid && field.touched}>
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
        <TouchedMessages field={field} />
      </FormGroup>
    </Section>
  ));
}
