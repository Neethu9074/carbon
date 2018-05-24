import { storiesOf } from '@storybook/react';
import React from 'react';

import Badge, { kinds } from 'in-new-components/Badge/Badge';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/Badge', module).add('Kinds', () => <Badges />);

function Badges() {
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
              <Badge kind={kind}>3</Badge>
            </div>
          </Section>
        );
      })}
    </Root>
  );
}
