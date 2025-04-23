/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Pill } from '@instana/components';

import ComboBox from 'in-components/ComboBox/CarbonComboBox';
import type { Option } from 'in-components/ComboBox/types';

export default {
  component: ComboBox
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

export const CarbonComboBoxDefault = () => {
  const [value, setValue] = useState('');
  return (
    <>
      <div style={{ margin: '1rem' }}>Single selection</div>
      <div style={{ margin: '1rem' }}>Carbon</div>
      <ComboBox
        value={value}
        options={options}
        onChange={t => {
          setValue((t as Option)?.value);
        }}
      />
    </>
  );
};

export const CarbonComboBoxSingleNotClearable = () => {
  const [valueC, setValueC] = useState('chocolate');
  return (
    <>
      <div style={{ margin: '1rem' }}>Carbon</div>
      <ComboBox
        value={valueC}
        options={options}
        onChange={t => {
          setValueC((t as Option)?.value);
        }}
        isClearable={false}
      />
    </>
  );
};

export const ComboBoxSingleWithPlaceholder = () => {
  const [value, setValue] = useState('');
  return (
    <ComboBox
      value={value}
      options={options}
      onChange={t => {
        setValue((t as Option)?.value);
      }}
      placeholder="Choose a flavor"
    />
  );
};

export const ComboBoxSingleWithDisabledOption = () => {
  const [value, setValue] = useState('');
  return (
    <ComboBox
      value={value}
      options={options1}
      isOptionDisabled={t => t?.isDisabled ?? false}
      onChange={t => {
        setValue((t as Option)?.value);
      }}
    />
  );
};

export const ComboBoxSingleDisabled = () => {
  const [value, setValue] = useState('chocolate');
  return (
    <ComboBox
      value={value}
      options={options}
      isDisabled
      onChange={t => {
        setValue((t as Option)?.value);
      }}
    />
  );
};

function Decorate(props: any) {
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
    <ComboBox
      value={value}
      options={options}
      onChange={t => {
        setValue((t as Option)?.value);
      }}
      components={{ Decorate }}
    />
  );
};

export const ComboBoxSingleClearable = () => {
  const [value, setValue] = useState('');
  return (
    <>
      <ComboBox
        value={value}
        options={options}
        onChange={t => {
          setValue((t as Option)?.value);
        }}
        components={{ Decorate }}
      />
      <div>{`Selected value: ${value}`}</div>
    </>
  );
};

export const ComboBoxWithFilterHighlight = () => {
  const [value, setValue] = useState('');
  return (
    <>
      <ComboBox
        value={value}
        placeholder="Select an option"
        options={options}
        onChange={t => {
          setValue((t as Option)?.value);
        }}
        highlightFilter
      />
      <div>{`Selected value: ${value}`}</div>
    </>
  );
};

const lotsOfOptions: Option[] = [];
for (let i = 1; i < 500; i++) {
  const label = `Label_${i}`;
  lotsOfOptions.push({ label: label, value: i.toString() });
}

export const ComboBoxWithRowLimit = () => {
  const [value, setValue] = useState('');
  return (
    <>
      <ComboBox
        value={value}
        placeholder="Select an option"
        options={lotsOfOptions}
        onChange={t => {
          setValue((t as Option)?.value);
        }}
        resultsToShow={10}
      />
      <div>{`Selected value: ${value}`}</div>
    </>
  );
};

export const ComboBoxCarbon = () => {
  const [value, setValue] = useState('chocolate');
  return (
    <ComboBox
      value={value}
      options={options}
      onChange={t => {
        setValue((t as Option)?.value);
      }}
    />
  );
};
