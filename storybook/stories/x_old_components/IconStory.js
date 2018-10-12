import { withKnobs, number } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { getAllSvgIconPaths } from 'in-sdk/iconRegistry';
import icons from 'in-components/SvgIcon/registry.json';
import SvgIcon from 'in-components/SvgIcon';
import Root from '../_helpers/Root';

function sizeGetter() {
  return number('Size', 16, {
    range: true,
    min: 8,
    max: 64,
    step: 1
  });
}

storiesOf('old_components/Icons', module)
  .addDecorator(withKnobs)
  .add('Common', () => <SvgIconList />)
  .add('Plugin', () => <PluginIcons />);

function SvgIconList() {
  return (
    <Root>
      <List icons={Object.keys(icons).filter(icon => !icon.startsWith('lib'))} />
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
          <SvgIcon type={icon} width={sizeGetter()} height={sizeGetter()} color="#000" spinning={icon === 'spinner'} />
          <span style={{ marginLeft: '0.8rem' }}>{icon}</span>
        </li>
      ))}
    </ul>
  );
}

function PluginIcons() {
  const pathById = {};
  const ids = [];
  getAllSvgIconPaths().forEach(icon => {
    pathById[icon.id] = icon.path;
    ids.push(icon.id);
  });
  ids.sort();

  return (
    <Root>
      <ul>
        {ids.sort().map(icon => (
          <li key={icon} style={{ margin: '0.5rem 1rem' }}>
            <svg width={sizeGetter()} height={sizeGetter()} viewBox="0 0 128 128" fill="#000">
              {/* Ensure that the whole width/height is clickable in Safari */}
              <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
              <path d={pathById[icon]} />
            </svg>
            <span style={{ marginLeft: '0.8rem' }}>{icon}</span>
          </li>
        ))}
      </ul>
    </Root>
  );
}
