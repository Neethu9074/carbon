import { withKnobs, select } from '@storybook/addon-knobs';
import { shuffle } from 'lodash';
import React from 'react';

import SvgIcon, { infrastructurePluginPrefix } from 'in-components/SvgIcon';
import icons from 'in-components/SvgIcon/registry.json';
import { plugins } from 'in-forge/constants';

export default {
  title: 'Atoms/SvgIcon',
  component: SvgIcon,
  decorators: [withKnobs]
};

const iconsOptions = Object.keys(icons).filter(icon => icon.startsWith('lib'));
const options = {
  black: '#000',
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

export const Default = () => {
  const color = select('Color', options, '#000');
  const type = select('Icons', iconsOptions, 'lib_application_service');
  return <SvgIcon type={type} color={color} />;
};

export const InfraPluginIcons = () => {
  const types = shuffle([...Object.keys(icons), ...Object.keys(plugins).map(p => infrastructurePluginPrefix + p)]);
  return (
    <>
      <p>
        This story is used to verify that infrastructure plugin icons used via the <code>SvgIcon</code>
        have the same size the <em>regular</em> icons. To make this verification easy this story shows all the{' '}
        <em>regular</em> and <em>infrastructure plugin</em> icons mixed together.
      </p>

      {types.map(type => (
        <SvgIcon key={type} type={type} />
      ))}
    </>
  );
};
