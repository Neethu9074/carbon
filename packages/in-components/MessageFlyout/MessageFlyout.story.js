/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { resetStoreRegistry } from 'in-stores/store';
import MessageFlyout from './MessageFlyout';

export default {
  component: MessageFlyout
};

resetStoreRegistry();
addMessage({ type: 'warning', title: 'Message 1', content: <div /> });
addMessage({ type: 'info', title: 'Message 2', content: <div /> });

export const MessagesWithFlyout = {
  args: {
    onlyShowUsageRelatedMessages: false
  }
};
