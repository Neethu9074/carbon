/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';
import ComboBox from 'in-components/ComboBox/ComboBox';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default {
  title: 'Templates|forms/FormGroup',
  component: FormGroup
};

export function InputStory() {
  const p = { type: 'text', onChange: () => {} };
  return (
    <>
      <h2>Default-Prefilled</h2>
      <FormGroup>
        <Label>Field label</Label>
        <Input {...p} placeholder="Some copy" />
      </FormGroup>

      <h2>Default</h2>
      <FormGroup>
        <Label>Field label</Label>
        <Input {...p} value="Some copy" />
      </FormGroup>

      <h2>Focus</h2>
      <FormGroup>
        <Label>Field label</Label>
        <Input {...p} value="Some copy" autoFocus />
      </FormGroup>

      <h2>Disabled</h2>
      <FormGroup>
        <Label disabled>Field label</Label>
        <Input {...p} value="Some copy" disabled />
      </FormGroup>

      <h2>Feedback</h2>
      <FormGroup>
        <Label>Field label</Label>
        <Input {...p} value="Some copy" />
        <ValidationBlock hasError>Error message</ValidationBlock>
      </FormGroup>
    </>
  );
}

export function SelectStory() {
  return (
    <>
      <h2>Default</h2>

      <p>
        A plain HTML select box. This component is slowly being phased out. See
        <code>ComboBox</code> for a more modern equivalents.
      </p>

      <FormGroup>
        <Label>Field label</Label>
        <Select onChange={() => {}} autoComplete="off">
          <option value="foo">foo</option>
          <option value="bar">bar</option>
          <option value="baz">baz</option>
        </Select>
      </FormGroup>

      <h2>Disabled</h2>
      <FormGroup>
        <Label>Field label</Label>
        <Select disabled onChange={() => {}} autoComplete="off">
          <option value="foo">foo</option>
          <option value="bar">bar</option>
          <option value="baz">baz</option>
        </Select>
      </FormGroup>
    </>
  );
}

export function ComboBoxStory() {
  const [value, setValue] = useState(null);
  const options = [
    { value: 'foo', label: 'foo' },
    { value: 'bar', label: 'bar' },
    { value: 'baz', label: 'baz' }
  ];

  return (
    <>
      <h2>Default</h2>
      <FormGroup>
        <Label>Field label</Label>
        <ComboBox
          value={value}
          options={options}
          onChange={e => (e ? setValue(e.value) : setValue(null))}
          placeholder="Type…"
        />
      </FormGroup>

      <h2>Disabled</h2>
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
    </>
  );
}
