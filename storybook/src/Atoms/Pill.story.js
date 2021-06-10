/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withKnobs, text, select } from '@storybook/addon-knobs';
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

export default {
  title: 'Atoms|Pill',
  component: Pill,
  decorators: [withKnobs]
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

export const bold = () => {
  return <Pill color={select('Color', options, '#00B3B3')}>{text('Label', 'Placeholder')}</Pill>;
};
export const light = () => {
  return (
    <Pill kind="light" color={select('Color', options, '#00B3B3')}>
      {text('Label', 'Placeholder')}
    </Pill>
  );
};
export const lighter = () => <Pill kind="lighter">Lighter</Pill>;
export const inverted = () => {
  return (
    <Pill kind="inverted" color={select('Color', options, '#00B3B3')}>
      {text('Label', 'Placeholder')}
    </Pill>
  );
};
