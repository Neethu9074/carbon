import { storiesOf } from '@storybook/react';
import React from 'react';

import theme from 'in-themes';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Utilities/Shapes', module).add('shapes', () => <Shapes />);

function Shapes() {
  return (
    <Root>
      <Section title="Straight">
        <Rect />
      </Section>
      <Section title="Small">
        <Rect borderRadius={theme.lib.shapes.radius_small} />
      </Section>
      <Section title="Medium">
        <Rect borderRadius={theme.lib.shapes.radius_medium} />
      </Section>
      <Section title="Large">
        <Rect borderRadius={theme.lib.shapes.radius_large} />
      </Section>
      <Section title="Round">
        <Rect borderRadius={theme.lib.shapes.radius_round} />
      </Section>
    </Root>
  );
}

function Rect({ borderRadius }) {
  return <div style={{ marginLeft: 16, width: 24, height: 24, background: theme.lib.colors.primary1, borderRadius }} />;
}
