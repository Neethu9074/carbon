/*eslint-disable no-console*/

'use strict';

import {
  getActiveSubscriptions,
  emitter
} from 'instana-ui-services/connection/subscriptionAwareConnection';

// subscription id => {
//   firstMessage,
//   lastMessage,
//   messageCount
// }
const messageCounter = {};

startCountingMessages();

window.instana.printSubscriptionStats = () => {
  setActiveState();
  console.log('Subscription Infos:');
  console.table(messageCounter);
};

window.instana.removeInactiveSubscriptionStats = () => {
  setActiveState();
  Object.keys(messageCounter).forEach(key => {
    if (!messageCounter[key].active) {
      delete messageCounter[key];
    }
  });
};

function startCountingMessages() {
  emitter.on('message').subscribe(event => {
    if (!('id' in event)) {
      return;
    }

    const id = String(event.id);
    if (!(id in messageCounter)) {
      const counter = {
        firstMessage: new Date().toISOString(),
        lastMessage: new Date().toISOString(),
        messageCount: 1,
        active: true
      };
      messageCounter[id] = counter;
    } else {
      messageCounter[id].messageCount++;
      messageCounter[id].lastMessage = new Date().toISOString();
    }

    messageCounter[id].lastMessageContent = JSON.stringify(event);
  });
}

function setActiveState() {
  const activeSubscriptions = getActiveSubscriptions();
  const activeIds = Object.keys(activeSubscriptions);

  activeIds.forEach(id => {
    if (!(id in messageCounter)) {
      messageCounter[id] = {
        firstMessage: 'NEVER',
        lastMessage: 'NEVER',
        messageCount: 0,
        active: true
      };
    }

    const subscription = activeSubscriptions[id];
    if (subscription.pluginId) {
      subscription.pluginId = subscription.pluginId.replace(/^.*\.([^.]+)$/i, '$1');
    }
    delete subscription.id;
    delete subscription.event;
    messageCounter[id]['Subscription Type'] = subscription.type;
    delete subscription.type;
    messageCounter[id].data = JSON.stringify(subscription);
  });

  Object.keys(messageCounter).forEach(id => {
    messageCounter[id].active = activeIds.indexOf(id) !== -1;
  });
}
