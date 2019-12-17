import React from 'react';

import Message from 'in-new-components/Message';

import theme from 'in-themes';
export default {
  title: 'Molecules|Message',
  component: Message
};

export const DefaultMessage = () => {
  return <Message>This is a message.</Message>;
};

export const DismissibleMessage = () => {
  return <Message dismissible>This is a dismissible message.</Message>;
};

export const DismissibleMessageWithIcon = () => {
  return (
    <Message withIcon dismissible>
      This is a dismissible message showing an optional icon.
    </Message>
  );
};

export const DismissibleMessageWithIconSmallSize = () => {
  return (
    <Message withIcon dismissible small>
      This is a dismissible message showing an optional icon.
    </Message>
  );
};

export const DismissibleMessageWithCustomIcon = () => {
  return (
    <Message withIcon type="warning" iconColor={theme.lib.colors.warning} dismissible>
      This is a dismissible message showing a custom icon. This is a dismissible message showing a custom icon. This is
      a dismissible message showing a custom icon. This is a dismissible message showing a custom icon. This is a
      dismissible message showing a custom icon. This is a dismissible message showing a custom icon. dismissible
      message showing a custom icon. This is a dismissible message showing a custom icon. dismissible message showing a
      custom icon. This is a dismissible message showing a custom icon. dismissible message showing a custom icon. This
      is a dismissible message showing a custom icon.
    </Message>
  );
};
