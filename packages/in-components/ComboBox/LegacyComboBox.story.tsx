/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import {Pill} from '@instana/components'

import {default as LegacyComboBox} from './LegacyComboBox';

export default {
  component: LegacyComboBox
};

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

const options1 = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry', isDisabled: true },
  { value: 'vanilla', label: 'Vanilla' }
];

export const LegacyComboBoxDefault = () => {
  const [valueL, setValueL] = useState(null);
  return (
    <>
      <div style={{margin: '1rem'}}>Single selection</div>
      <div style={{width: '20rem'}}>
        <div style={{margin: '1rem'}}>Legacy</div>
        <LegacyComboBox
          value={valueL}
          options={options}
          onChange={(t: any) => {
            setValueL(t?.value);
          }}
        />
      </div>
    </>
  );
};

export const LegacyComboBoxSingleNotClearable = () => {
  const [valueL, setValueL] = useState('');
  return (
      <>
        <div style={{margin: '1rem'}}>Legacy</div>
        <LegacyComboBox
            value={valueL}
            options={options}
            onChange={(t: any) => {
              setValueL(t?.value);
            }}
            isClearable={false}
            defaultValue={options[0]}
          />
      </>
  );
};


export const ComboBoxSingleWithPlaceholder = () => {
  const [value, setValue] = useState('');
  return (
    <LegacyComboBox
      value={value}
      options={options}
      onChange={(t: any) => {
        setValue(t?.value);
      }}
      placeholder="Choose a flavor"
    />
  );
};

export const ComboBoxSingleWithDisabledOption = () => {
  const [value, setValue] = useState('');
  return (
    <LegacyComboBox
      value={value}
      options={options1}
      isOptionDisabled={t => t?.isDisabled ?? false}
      onChange={(t: any) => {
        setValue(t?.value);
      }}
    />
  );
};

export const ComboBoxSingleDisabled = () => {
  const [value, setValue] = useState('chocolate');
  return (
    <LegacyComboBox
      value={value}
      options={options}
      isDisabled
      onChange={(t: any) => {
        setValue(t?.value);
      }}
    />
  );
};

function Option(props: any) {
  const { data: option } = props;
  return (
    <div>
      {option.label}
      <Pill>{`special label ${option.label}`}</Pill>
    </div>
  );
}

export const ComboBoxSingleCustom = () => {
  const [value, setValue] = useState('chocolate');
  return (
    <LegacyComboBox
      value={value}
      options={options}
      onChange={(t: any) => {
        setValue(t?.value);
      }}
      components={{ Option }}
    />
  );
};

export const ComboBoxCarbon = () => {
  const [value, setValue] = useState('chocolate');
  return (
    <LegacyComboBox
      value={value}
      options={options}
      onChange={(t: any) => {
        setValue(t?.value);
      }}
    />
  );
};
