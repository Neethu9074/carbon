import { storiesOf } from '@storybook/react';
import React from 'react';

import Toggle from 'in-components/form/Toggle';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/Toggle', module).add('Toggle', () => <ToggleStory />);

function ToggleStory() {
  return (
    <Root>
      <Section title="On">
        <Toggle checked onChange={() => {}} />
      </Section>

      <Section title="Off">
        <Toggle checked={false} onChange={() => {}} />
      </Section>

      <Section title="On-disabled">
        <Toggle checked disabled onChange={() => {}} />
      </Section>

      <Section title="Off-disabled">
        <Toggle checked={false} disabled onChange={() => {}} />
      </Section>
    </Root>
  );
}
