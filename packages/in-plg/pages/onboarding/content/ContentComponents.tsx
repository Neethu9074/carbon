/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import CheckboxFancy from 'in-components/form/CheckboxFancy';
import FormInput from 'in-components/form/Input/Input';
import InputComponent from 'in-components/form/Input';
import Select from 'in-components/form/Select';
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

  return (
    <Button target="_blank" icon="lib_actions_download" iconSize="xs" kind="subtle" noAutoMargin onClick={clickHandler}>
      {''}
    </Button>
  );
}

export function CheckBox({ label, checked, setChecked }: { label: string; checked: boolean; setChecked: any }) {
  return (
    <CheckboxFancy
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
  placeholder
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return <FormInput value={value} placeholder={placeholder} className={locals.inputField} onChange={handleChange} />;
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
  placeholder
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return <FormInput value={value} placeholder={placeholder} className={locals.inputField} onChange={handleChange} />;
}
