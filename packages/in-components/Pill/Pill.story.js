/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Pill, { kinds } from 'in-components/Pill';

const options = {
  teal800: '#00B3B3',
  pink800: '#E62E8A',
  purple800: '#BF73E6',
  deepPurple800: '#8257D9',
  indigo800: '#4D4DBF',
  blue800: '#2483B3',
  lightBlue800: '#17A1E6',
  cyan800: '#00CCCC',
  green800: '#39BF7C',
  lime800: '#ADCC14',
  slushGreen800: '#4596A4',
  navy800: '#475E66',
  navy900: '#031F29',
  yellow800: '#FFC600',
  orange800: '#FF8C19',
  red800: '#FF4040'
};
const colorArgType = {
  color: {
    control: 'select',
    options: Object.keys(options),
    mapping: options
  }
};

export default {
  component: Pill
};

export const Default = props => <Pill {...props} />;
Default.args = {
  color: Object.keys(options)[0],
  children: 'some text'
};
Default.argTypes = {
  ...colorArgType,
  kind: {
    type: 'select',
    options: ['', ...kinds]
  }
};

export const allPredefinedColorStyles = () => {
  return (
    <>
      {kinds.map(kind => (
        <Pill kind={kind}>{kind}</Pill>
      ))}
    </>
  );
};

export const bold = props => <Pill color={props.color}>{props.label}</Pill>;
bold.args = {
  color: Object.keys(options)[0],
  label: 'Placeholder'
};
bold.argTypes = { ...colorArgType };

export const light = props => (
  <Pill kind="light" color={props.color}>
    {props.label}
  </Pill>
);
light.args = {
  color: Object.keys(options)[0],
  label: 'Placeholder'
};
light.argTypes = { ...colorArgType };

export const lighter = () => <Pill kind="lighter">Lighter</Pill>;

export const inverted = props => (
  <Pill kind="inverted" color={props.color}>
    {props.label}
  </Pill>
);
inverted.args = { color: Object.keys(options)[0], label: 'Placeholder' };
inverted.argTypes = { ...colorArgType };
