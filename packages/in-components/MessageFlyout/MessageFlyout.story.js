/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { addMessage, removeAllMessages } from 'in-components/MessageFlyout/stores/messages';
import MessageFlyout from 'in-components/MessageFlyout/MessageFlyout';

export default {
  component: MessageFlyout
};

removeAllMessages();

addMessage({ isLicenseUsageMsg: true, type: 'neutral', title: 'Message to simulate license usage info' });
addMessage({ type: 'danger', title: 'Message error', content: <div>Some content</div> });
addMessage({ type: 'warning', title: 'Message warning', content: <div /> });
addMessage({ type: 'neutral', title: 'Message info', content: <div>Some content</div> });
addMessage({
  type: 'neutral',
  title: 'Message info',
  content: <div>disappears after 2 seconds</div>,
  timeout: 2000
});
addMessage({ type: 'neutral', title: 'Only with title, without content' });
addMessage({ type: 'neutral', content: 'No title, only content -- BAD PRACTICE -- ADD A TITLE' });
addMessage({
  type: 'neutral',
  title: 'Some very very very long title, for testing purpose.',
  content: 'this is also a very very very long content, for testing purpose.'
});
addMessage({ type: 'success', title: 'Successful', content: 'Action was successful' });

export const MessagesWithFlyout = {};
