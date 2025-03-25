/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  NumberInput,
  TextInput,
  PasswordInput,
  FormLabel,
  Stack,
  Form,
  FormGroup,
  Select,
  TextArea,
  HelpText,
  ValidationBlock
} from '@instana/components';

export default {
  component: FormGroup
};

function InputStory(size) {
  const sz = size === 'sm' ? 'small' : 'default - medium';
  const p = { onChange: () => {} };
  return (
    <div style={{ width: '50%' }}>
      <h2 style={{ paddingBottom: '1rem' }}>{`Carbon input form - ${sz}`}</h2>
      <Form>
        <HelpText>Helper text that should be moved as a property of individual imput components</HelpText>
        <ValidationBlock>
          This is block of validation text that should be moved as a property of individual input components
        </ValidationBlock>
        <FormGroup>
          <Stack gap="medium">
            <NumberInput label="Number field" value={5} min={5} max={100} size={size} />
            <TextInput {...p} labelText="Text field" placeholder="Some copy" size={size} />
          </Stack>
        </FormGroup>

        <FormGroup>
          <TextInput {...p} labelText="Another text field" value="Some copy" size={size} />
        </FormGroup>

        <FormGroup>
          <TextInput {...p} labelText="Focus here" value="Some copy" autoFocus size={size} />
        </FormGroup>

        <FormGroup>
          <FormLabel>The field below is read only</FormLabel>
          <TextInput {...p} label="Info only" value="Some copy" readOnly size={size} />
        </FormGroup>

        <FormGroup>
          <FormLabel>The field below is disabled</FormLabel>
          <TextInput {...p} label="Info only" value="Some copy" disabled size={size} />
        </FormGroup>

        <FormGroup>
          <FormLabel>Illustrate an error</FormLabel>
          <PasswordInput
            {...p}
            labelText="Password field"
            value="secret"
            invalid
            invalidText="Error message"
            helperText="Follow password rules"
            size={size}
          />
        </FormGroup>
        <FormGroup>
          <TextArea labelText="Multiple line text input" />
        </FormGroup>
        <FormGroup>
          <Select labelText="Field label" noLabel={false} onChange={() => {}} autoComplete="off" size={size}>
            <option value="foo">foo</option>
            <option value="bar">bar</option>
            <option value="baz">baz</option>
          </Select>
        </FormGroup>
      </Form>
    </div>
  );
}

export function InputStoryRegular() {
  return InputStory('md');
}

export function InputStorySmall() {
  return InputStory('sm');
}

export function SelectStory() {
  return (
    <div style={{ width: '50%' }}>
      <h2>Carbon select form</h2>
      <p style={{ marginBottom: '1rem' }}>
        A plain HTML select box. This component is slowly being phased out. See
        <code>ComboBox</code> for a more modern equivalents.
      </p>

      <Form>
        <Stack gap="large">
          <FormGroup>
            <Select labelText="Field label" noLabel={false} onChange={() => {}} autoComplete="off">
              <option value="foo">foo</option>
              <option value="bar">bar</option>
              <option value="baz">baz</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <FormLabel>Disabled</FormLabel>
            <Select labelText="Field label" noLabel={false} disabled onChange={() => {}} autoComplete="off">
              <option value="foo">foo</option>
              <option value="bar">bar</option>
              <option value="baz">baz</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <FormLabel>Read only</FormLabel>
            <Select labelText="Field label" noLabel={false} readOnly onChange={() => {}} autoComplete="off">
              <option value="foo">foo</option>
              <option value="bar">bar</option>
              <option value="baz">baz</option>
            </Select>
          </FormGroup>
        </Stack>
      </Form>
    </div>
  );
}
