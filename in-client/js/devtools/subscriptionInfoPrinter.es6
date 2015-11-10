/* eslint-disable no-console */
import {
  getActiveSubscriptions,
  emitter
} from 'in-services/connection/subscriptionAwareConnection';

window.instana.dev = window.instana.dev || {};

// subscription id => {
//   firstMessage,
//   lastMessage,
//   messageCount
// }
const messageCounter = {};

startCountingMessages();

window.instana.dev.printSubscriptionStats = () => {
  setActiveState();
  console.log('Subscription Infos:');
  console.table(messageCounter);
};

window.instana.dev.removeInactiveSubscriptionStats = () => {
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
    const dateObject = new Date();
    if (!(id in messageCounter)) {
      const counter = {
        firstMessage: dateObject.toISOString(),
        lastMessage: dateObject.toISOString(),
        messageCount: 1,
        active: true
      };
      messageCounter[id] = counter;
    } else {
      messageCounter[id].messageCount++;
      messageCounter[id].lastMessage = dateObject.toISOString();
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
