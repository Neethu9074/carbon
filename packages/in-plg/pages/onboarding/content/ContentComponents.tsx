/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  Field,
  MapForm,
  MapFormItems,
  UpdatedMapForm,
  ValidationResult,
  composeValidators,
  createField,
  createMapForm
} from 'formalistic';
import React, { useState } from 'react';
import { get } from 'lodash';

import { Select, Checkbox, IconButton } from '@instana/components';

import { notBlankValidator } from 'in-services/validators/string';
import FormInput from 'in-components/form/Input/Input';
import InputComponent from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { region } from 'in-services/config';

import locals from './ContentComponents.mless';

export function toURLstring(str?: string) {
  return encodeURIComponent(str ? str : '');
}

export function getAgentDownloadURL(
  tenant?: string,
  tenantUnit?: string,
  agentKey?: string,
  downloadKey?: string,
  option?: string,
  butlerDomain?: string
) {
  return `https://${butlerDomain}/assets/agent/${tenant}/${tenantUnit}?agentKey=${toURLstring(
    agentKey
  )}&downloadKey=${toURLstring(downloadKey)}&type=${toURLstring(option)}${
    region ? `&region=${toURLstring(region)}` : ''
  }`;
}

interface DropDownProps {
  value: string | { key: string; label: string };
  options: string[] | { key: string; label: string }[];
  onChange: (value: string) => void;
}

export function DropDown({ value, options, onChange }: DropDownProps) {
  return (
    <Select
      className={locals.dropDown}
      value={typeof value === 'object' ? value.key : value}
      onChange={e => onChange(e.target.value)}
      autoComplete="off"
    >
      {options.map(option => (
        <option
          key={typeof option === 'object' ? option.key : option}
          value={typeof option === 'object' ? option.key : option}
        >
          {typeof option === 'object' ? option.label : option}
        </option>
      ))}
    </Select>
  );
}

export function DownloadButton({ href, fileName }: { href: string; fileName: string }) {
  const clickHandler = () => {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.target = '_blank';
    anchor.download = fileName;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return <IconButton target="_blank" type="lib_actions_download" iconSize="xs" kind="subtle" onClick={clickHandler} />;
}

export function CheckBox({ label, checked, setChecked }: { label: string; checked: boolean; setChecked: any }) {
  return (
    <Checkbox
      wrapperClassName={locals.checkbox}
      label={label}
      checked={checked}
      onChange={() => setChecked(!checked)}
      size="large"
    />
  );
}

export function AgentFormInput({
  value,
  onChange,
  placeholder,
  maxLength
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <FormInput
      value={value}
      placeholder={placeholder}
      className={locals.inputField}
      onChange={handleChange}
      maxLength={maxLength}
    />
  );
}

export function Input({
  id,
  value,
  onChange,
  placeholder,
  hasError
}: {
  id: string;
  value: string;
  onChange: any;
  placeholder: string;
  hasError: boolean;
}) {
  return (
    <InputComponent
      className={locals.input}
      type="text"
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      hasError={hasError}
      autoComplete="off"
    />
  );
}

export function FormInputPlg({
  value,
  onChange,
  placeholder,
  maxLength
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <FormInput
      value={value}
      placeholder={placeholder}
      className={locals.inputField}
      onChange={handleChange}
      maxLength={maxLength}
    />
  );
}

interface InputFieldProp {
  name: string;
  placeholder: string;
  validate: (value: string) => ValidationResult;
}

interface ValidatedInputFieldsProps {
  fields: InputFieldProp[];
  renderContent: (props: Record<string, any>) => JSX.Element;
}

export function ValidatedInputFields({ fields, renderContent }: ValidatedInputFieldsProps) {
  const [form, setForm] = useState<MapForm<MapFormItems> | UpdatedMapForm<MapFormItems, string, Field<string>>>(() =>
    createForm(fields)
  );

  const props: Record<string, string | JSX.Element | undefined> = {};

  function update(key: string) {
    return (newValue: string) => {
      const updatedForm = form as MapForm<{ [key: string]: Field<string> }>;

      setForm(
        updatedForm.updateIn<[string], Field<string>>([key], (f: Field<string>) =>
          f.setValue(newValue).setTouched(true)
        )
      );
    };
  }

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const onChange = update(field.name);
    const formField = form.get(field.name) as Field<string>;
    props[field.name] = (formField as Field<string>).value;
    props[`${field.name}ValidationMessage`] = get(formField, ['messages', 0, 'message']);
    props[`${field.name}Input`] = (
      <>
        <Tooltip
          content={
            !formField.valid && formField.touched && props[`${field.name}ValidationMessage`]
              ? props[`${field.name}ValidationMessage`]
              : undefined
          }
          align="mousePosition"
        >
          <div>
            <Input
              id={field.name}
              key={field.name}
              value={formField.value}
              onChange={onChange}
              placeholder={field.placeholder}
              hasError={!formField.valid && formField.touched}
            />
          </div>
        </Tooltip>
      </>
    );
  }
  return renderContent(props);
}

function createForm(fields: InputFieldProp[]) {
  let form = createMapForm();
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    form = form.put(
      field.name,
      createField({
        value: '',
        validator: composeValidators(notBlankValidator, field.validate)
      })
    ) as MapForm<MapFormItems>;
  }

  return form;
}
