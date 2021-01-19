/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withKnobs, select } from '@storybook/addon-knobs';
import React from 'react';

import icons from 'in-components/SvgIcon/registry.json';
import SvgIcon, { sizes } from 'in-components/SvgIcon';

export default {
  title: 'DesignTokens|Icons',
  parameters: {
    // when only one icon was added/removed this lead to a failing ui-test,
    // so we disable this, because too many changes break it too easily.
    chromatic: { disable: true }
  },
  decorators: [withKnobs]
};

function sizeGetter() {
  return select('Size', sizes, sizes.regular);
}

export const SvgIconList = () => {
  return <List icons={Object.keys(icons).filter(icon => icon.startsWith('lib'))} />;
};

function List({ icons }) {
  return (
    <>
      <p>Configure size via storybook-knobs-addon!</p>
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
    </>
  );
}
