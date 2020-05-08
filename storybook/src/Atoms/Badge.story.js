import { withKnobs, text, select } from '@storybook/addon-knobs';
import React from 'react';

import Badge from 'in-new-components/Badge/Badge';

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
  title: 'Atoms|Badge',
  component: Badge,
  decorators: [withKnobs]
};

export const bold = () => {
  const label = text('Label', 'Placeholder');
  const color = select('Color', options, '#00B3B3');

  return <Badge color={color}>{label}</Badge>;
};

export const inverted = () => <Badge kind="inverted">Inverted</Badge>;
