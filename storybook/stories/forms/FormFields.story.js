import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';
import ComboBox from 'in-components/ComboBox/ComboBox';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Forms/Form Fields', module)
  .add('Input', () => <InputStory />)
  .add('Select', () => <SelectStory />)
  .add('ComboBox', () => <ComboBoxStory />);

function InputStory() {
  const p = { type: 'text', onChange: () => {} };
  return (
    <Root>
      <Section title="Default-Prefilled">
        <FormGroup>
          <Label>Field label</Label>
          <Input {...p} placeholder="Some copy" />
        </FormGroup>
      </Section>

      <Section title="Default">
        <FormGroup>
          <Label>Field label</Label>
          <Input {...p} value="Some copy" />
        </FormGroup>
      </Section>

      <Section title="Focus">
        <FormGroup>
          <Label>Field label</Label>
          <Input {...p} value="Some copy" autoFocus />
        </FormGroup>
      </Section>

      <Section title="Disabled">
        <FormGroup>
          <Label disabled>Field label</Label>
          <Input {...p} value="Some copy" disabled />
        </FormGroup>
      </Section>

      <Section title="Feedback">
        <FormGroup>
          <Label>Field label</Label>
          <Input {...p} value="Some copy" />
          <ValidationBlock hasError>Error message</ValidationBlock>
        </FormGroup>
      </Section>
    </Root>
  );
}

function SelectStory() {
  return (
    <Root>
      <Section title="Default">
        <FormGroup>
          <Label>Field label</Label>
          <Select onChange={() => {}} autoComplete="off">
            <option value="foo">foo</option>
            <option value="bar">bar</option>
            <option value="baz">baz</option>
          </Select>
        </FormGroup>
      </Section>

      <Section title="Disabled">
        <FormGroup>
          <Label>Field label</Label>
          <Select disabled onChange={() => {}} autoComplete="off">
            <option value="foo">foo</option>
            <option value="bar">bar</option>
            <option value="baz">baz</option>
          </Select>
        </FormGroup>
      </Section>
    </Root>
  );
}

function ComboBoxStory() {
  const [value, setValue] = useState(null);
  const options = [{ value: 'foo', label: 'foo' }, { value: 'bar', label: 'bar' }, { value: 'baz', label: 'baz' }];

  return (
    <Root>
      <Section title="Default">
        <FormGroup>
          <Label>Field label</Label>
          <ComboBox
            value={value}
            options={options}
            onChange={e => (e ? setValue(e.value) : setValue(null))}
            placeholder="Type…"
          />
        </FormGroup>
      </Section>

      <Section title="Disabled">
        <FormGroup>
          <Label>Field label</Label>
          <ComboBox
            disabled
            value={value}
            options={options}
            onChange={e => (e ? setValue(e.value) : setValue(null))}
            placeholder="Type…"
          />
        </FormGroup>
      </Section>
    </Root>
  );
}
