/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createStore } from 'in-stores/store';

// used to generate IDs for messages
let idCounter = 0;

// Each message has the following format:
// {
//   id: <id>,
//   type: <info|warning|danger>
//   icon: <string name of SvgIcon>
//   timeout: <number ms till the message will be disposed again>
//   title: <string title>
//   content: <string longer message for description>
//   onClick?: <fn>
//   isLicenseUsageMsg: Optional, indicating that this message is from the license usage flyout
// }
const messagesStore = createStore({
  name: 'in-components/MessageFlyout/stores/messages',
  initialValue: []
});
export const messages$ = messagesStore.observable
  // support state manipulate in render methods
  .nextFrame();

export function addMessage(messageParam, id = null) {
  id = id == null ? idCounter++ : id;
  const message = {
    id,
    type: messageParam.type,
    icon: messageParam.icon ? messageParam.icon : getIconByType(messageParam.type),
    title: messageParam.title,
    content: messageParam.content,
    onClick: messageParam.onClick ? messageParam.onClick : () => removeMessage(id),
    isLicenseUsageMsg: !!messageParam.isLicenseUsageMsg
  };

  messagesStore.applyStateMutation(messages => {
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

  return id;
}

export function removeMessage(id) {
  messagesStore.applyStateMutation(messages => {
    messages = messages.slice();
    const i = getIndexOfMessage(messages, id);
    if (i !== -1) {
      messages.splice(i, 1);
    }
    return messages;
  });
}

function getIndexOfMessage(messages, id) {
  for (let i = 0, len = messages.length; i < len; i++) {
    if (messages[i].id === id) {
      return i;
    }
  }
  return -1;
}

function getIconByType(type) {
  if (type === 'warning' || type === 'danger') {
    return 'lib_events_inverted';
  }
  return 'lib_help_error_info_outline';
}
