import { storiesOf } from '@storybook/react';
import React from 'react';

import ButtonSegmentedControl from 'in-new-components/ButtonSegmentedControl';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Components/Button Segmented Control', module).add('ButtonSegmentedControl', () => (
  <ButtonSegmentedControlStory />
));

function ButtonSegmentedControlStory() {
  return (
    <Root>
      <Section title="Only one Button">
        <ButtonSegmentedControl buttonPropsList={[{ text: 'Button 1', key: '1' }]} activeKey="1" />
      </Section>

      <Section title="Two Buttons">
        <ButtonSegmentedControl
          buttonPropsList={[{ text: 'Button 1', key: '1' }, { text: 'Button 2', key: '2' }]}
          activeKey="2"
        />
      </Section>

      <Section title="Buttons">
        <ButtonSegmentedControl
          buttonPropsList={[
            { text: 'Button 1', key: '1' },
            { text: 'Button 2', key: '2' },
            { text: 'Button 3', key: '3' },
            { text: 'Button 4', key: '4' }
          ]}
          activeKey="2"
        />
      </Section>
    </Root>
  );
}
