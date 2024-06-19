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
addMessage({ id: 1, type: 'danger', title: 'Message error', content: <div>Some content</div> });
addMessage({ id: 2, type: 'warning', title: 'Message warning', content: <div /> });
addMessage({ id: 3, type: 'neutral', title: 'Message info', content: <div>Some content</div> });

export const MessagesWithFlyout = {
  args: {
    onlyShowUsageRelatedMessages: false,
    carbonVariant: true
  }
};
