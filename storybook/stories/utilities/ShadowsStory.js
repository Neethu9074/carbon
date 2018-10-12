import { storiesOf } from '@storybook/react';
import React from 'react';

import theme from 'in-themes';

import Root from '../_helpers/Root';

storiesOf('Utilities/Shadows', module).add('shadows', () => <ShadowsStory />);

function ShadowsStory() {
  return (
    <Root>
      <Rect style={{ background: '#ccc' }}>None</Rect>
      <Rect style={{ boxShadow: theme.lib.shadows.subtle }}>Subtle</Rect>
      <Rect style={{ boxShadow: theme.lib.shadows.pronounced }}>Pronounced</Rect>
      <Rect style={{ boxShadow: theme.lib.shadows.strong }}>Strong</Rect>
    </Root>
  );
}

function Rect({ style, children }) {
  return <div style={{ marginBottom: 36, padding: 16, ...style }}>{children}</div>;
}
