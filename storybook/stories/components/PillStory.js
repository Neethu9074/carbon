import { storiesOf } from '@storybook/react';
import React from 'react';

import Pill, { kinds } from 'in-new-components/Pill';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Components/Pill', module).add('Kinds', () => <Kinds />);

function Kinds() {
  return (
    <Root>
      {kinds.map(kind => {
        return (
          <Section key={kind} title={kind}>
            <div
              style={{
                display: 'inline-block',
                padding: '2px',
                background: kind == 'inverted' ? '#000000' : '#FFFFFF'
              }}
            >
              <Pill kind={kind}>Awesome</Pill>
            </div>
          </Section>
        );
      })}
    </Root>
  );
}
