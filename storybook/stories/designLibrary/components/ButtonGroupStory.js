import { storiesOf } from '@storybook/react';
import React from 'react';

import ButtonGroup from 'in-new-components/ButtonGroup';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/ButtonGroup', module).add('ButtonGroup', () => <ButtonGroupStory />);

function ButtonGroupStory() {
  return (
    <Root>
      <Section title="Only one Button">
        <ButtonGroup buttonPropsList={[{ text: 'Button 1', key: '1' }]} activeKey="1" />
      </Section>

      <Section title="Two Buttons">
        <ButtonGroup buttonPropsList={[{ text: 'Button 1', key: '1' }, { text: 'Button 2', key: '2' }]} activeKey="2" />
      </Section>

      <Section title="Buttons">
        <ButtonGroup
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
