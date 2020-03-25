import React from 'react';

import { success, warning, error } from 'in-new-components/Message/types';
import Message from 'in-new-components/Message';

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

export const BoldMessageWithIcon = () => {
  return (
    <Message withIcon bold>
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

export const Types = () => {
  return (
    <>
      <Message withIcon>This is a neutral message</Message>
      <Message type={success} withIcon>
        This is a success message
      </Message>
      <Message type={warning} withIcon>
        This is a warning message
      </Message>
      <Message type={error} withIcon>
        This is an errror message
      </Message>
    </>
  );
};
