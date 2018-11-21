import { storiesOf } from '@storybook/react';
import React from 'react';

import Message from 'in-new-components/Message';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Components/Message', module)
  .add('Message', () => <DefaultMessage />)
  .add('Dismissible message', () => <DismissibleMessage />);

function DefaultMessage() {

  return (
    <Root>
      <Section title="default">
        <Message>
          This is a message.
        </Message>
      </Section>
    </Root>
  );
}

function DismissibleMessage() {

  return (
    <Root>
      <Section title="dismissible">
        <Message dismissible>
          This is a dismissible message.
        </Message>
      </Section>
    </Root>
  );
}
