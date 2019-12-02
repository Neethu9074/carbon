import { storiesOf } from '@storybook/react';
import React from 'react';

import Message from 'in-new-components/Message';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

import theme from 'in-themes';

storiesOf('Components/Message', module)
  .add('Message', () => <DefaultMessage />)
  .add('Dismissible message', () => <DismissibleMessage />)
  .add('Dismissible message with icon', () => <DismissibleMessageWithIcon />)
  .add('Dismissible message with icon SMALL size', () => <DismissibleMessageWithIconSmallSize />)
  .add('Dismissible message with custom icon', () => <DismissibleMessageWithCustomIcon />);

function DefaultMessage() {
  return (
    <Root>
      <Section title="default">
        <Message>This is a message.</Message>
      </Section>
    </Root>
  );
}

function DismissibleMessage() {
  return (
    <Root>
      <Section title="dismissible">
        <Message dismissible>This is a dismissible message.</Message>
      </Section>
    </Root>
  );
}

function DismissibleMessageWithIcon() {
  return (
    <Root>
      <Section title="dismissible with info/error icon (default)">
        <Message withIcon dismissible>
          This is a dismissible message showing an optional icon.
        </Message>
      </Section>
    </Root>
  );
}

function DismissibleMessageWithIconSmallSize() {
  return (
    <Root>
      <Section title="dismissible with info/error icon (small)">
        <Message withIcon dismissible small>
          This is a dismissible message showing an optional icon.
        </Message>
      </Section>
    </Root>
  );
}

function DismissibleMessageWithCustomIcon() {
  return (
    <Root>
      <Section title="dismissible with warning icon and custom color">
        <Message withIcon type="warning" iconColor={theme.lib.colors.warning} dismissible>
          This is a dismissible message showing a custom icon. This is a dismissible message showing a custom icon. This
          is a dismissible message showing a custom icon. This is a dismissible message showing a custom icon. This is a
          dismissible message showing a custom icon. This is a dismissible message showing a custom icon. dismissible
          message showing a custom icon. This is a dismissible message showing a custom icon. dismissible message
          showing a custom icon. This is a dismissible message showing a custom icon. dismissible message showing a
          custom icon. This is a dismissible message showing a custom icon.
        </Message>
      </Section>
    </Root>
  );
}
