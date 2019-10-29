import { withKnobs, number } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import icons from 'in-components/SvgIcon/registry.json';

import Root from '../_helpers/Root';

function sizeGetter() {
  return number('Size', 24, {
    range: true,
    min: 1,
    max: 56,
    step: 1
  });
}

storiesOf('Utilities/Icons', module)
  .addDecorator(withKnobs)
  .add('Icons', () => <SvgIconList />);

function SvgIconList() {
  return (
    <Root>
      <List icons={Object.keys(icons).filter(icon => icon.startsWith('lib'))} />
    </Root>
  );
}

function List({ icons }) {
  return (
    <ul>
      {icons.sort().map(icon => (
        <li
          key={icon}
          style={{ display: 'inline-flex', alignItems: 'center', margin: '0.5rem 1rem', minWidth: '13rem' }}
        >
          <SvgIcon type={icon} size={sizeGetter()} color="#000" spinning={icon === 'lib_actions_loading'} />
          <span style={{ marginLeft: '0.8rem' }}>{icon}</span>
        </li>
      ))}
    </ul>
  );
}
