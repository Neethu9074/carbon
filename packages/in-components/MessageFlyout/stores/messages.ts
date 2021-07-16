/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { emptyArray } from 'in-services/fixedObjects';
import { createStore } from 'in-stores/store';

export type MessageId = number | string;

export interface Message {
  id?: MessageId;
  type: 'info' | 'warning' | 'danger';
  icon?: string;
  title: string;
  content: string;
  onClick?: () => void;
  isLicenseUsageMsg?: boolean;
  timeout?: number;
}

export interface MessageWithId extends Message {
  id: MessageId;
}

// used to generate IDs for messages
let idCounter = 0;

const messagesStore = createStore<Array<MessageWithId>>({
  name: 'messages',
  initialValue: []
});
export const messages$ = messagesStore.observable
  // support state manipulate in render methods
  .nextFrame();

export function addMessage(messageParam: Message, id: MessageId = idCounter++) {
  const message: MessageWithId = {
    id,
    type: messageParam.type,
    icon: messageParam.icon || getIconByType(messageParam.type),
    title: messageParam.title,
    content: messageParam.content,
    onClick: messageParam.onClick ? messageParam.onClick : () => removeMessage(id),
    isLicenseUsageMsg: !!messageParam.isLicenseUsageMsg
  };

  messagesStore.applyStateMutation(messages => {
    messages = messages || ((emptyArray as any) as MessageWithId[]);
    messages = messages.slice();
    const i = getIndexOfMessage(messages, id);
    if (i !== -1) {
      messages.splice(i, 1, message);
    } else {
      messages.push(message);
    }
    return messages;
  });

  if (messageParam.timeout) {
    setTimeout(() => removeMessage(id), messageParam.timeout);
  }

  return message.id;
}

export function removeMessage(id: MessageId) {
  messagesStore.applyStateMutation(messages => {
    messages = (messages || emptyArray).slice();
    const i = getIndexOfMessage(messages, id);
    if (i !== -1) {
      messages.splice(i, 1);
    }
    return messages;
  });
}

function getIndexOfMessage(messages: MessageWithId[], id: MessageId) {
  for (let i = 0, len = messages.length; i < len; i++) {
    if (messages[i].id === id) {
      return i;
    }
  }
  return -1;
}

function getIconByType(type: string) {
  if (type === 'warning' || type === 'danger') {
    return 'lib_events_inverted';
  }
  return 'lib_help_error_info_outline';
}
