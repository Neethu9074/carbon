import { createLogger } from 'instalog';
import SockJS from 'sockjs-client';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import AbstractState from 'in-services/connection/states/AbstractState';
import { isSafari } from 'in-services/browser';

const logger = createLogger('connection/states/ConnectionLostState');

let transports = ['xhr-polling', 'xhr-streaming', 'websocket'];
// We only want to use the WebSocket transport during local dev mode as this
// makes the development life easier: Only one connection needs to be inspected!
if (__DEV__) {
  // Safari does not support websocket connections with invalid SSL certs
  if (isSafari()) {
    transports = ['xhr-polling'];
  } else {
    transports = ['websocket'];
  }
}

export default class ConnectionLostState extends AbstractState {
  onEnter() {
    this.on('open', this.onOpen);
    this.on('close', this.onClose);
    this.sharedState.subscriptions.forEach(this.markSubscriptionDescriptionAsUnsubscribed, this);

    this.connectionAttempts = 0;
    this.attemptConnection();
  }

  onLeave() {
    this.off('open', this.onOpen);
    this.off('close', this.onClose);
  }

  markSubscriptionDescriptionAsUnsubscribed(subscriptionDescription) {
    subscriptionDescription.isSubscribedToBackend = false;
  }

  sendSubscribeWhenNecessary() {
    // not possible in this state
  }

  sendUnsubscribeWhenNecessary() {
    // not possible in this state
  }

  attemptConnection = () => {
    this.connectionAttempts++;

    if (this.sharedState.socket) {
      try {
        // ensure that no reconnect attempts are happening
        this.sharedState.socket.onopen = null;
        this.sharedState.socket.onclose = null;
        this.sharedState.socket.close();
        this.sharedState.socket = null;
      } catch (e) {
        // ignore
      }
    }

    if (this.connectionAttempts > 1) {
      addMessage(
        {
          type: 'warning',
          title: 'Connecting…',
          content: `Connection attempt ${this
            .connectionAttempts} failed. Continuing to retry to establish persistent backend connection.`
        },
        'connectionStatus'
      );
    } else {
      addMessage(
        {
          type: 'info',
          title: 'Connecting…',
          content: 'Establishing persistent backend connection.'
        },
        'connectionStatus'
      );
    }

    this.sharedState.socket = new SockJS('/api/data', null, { transports });
    this.sharedState.socket.onopen = () => this.sharedState.events.emit('open');
    this.sharedState.socket.onclose = () => this.sharedState.events.emit('close');
    this.sharedState.socket.onmessage = this.forwardMessageToEventHandlers;
  };

  onOpen = () => {
    removeMessage('connectionStatus');
    this.transitionTo('connected');
  };

  onClose = () => {
    setTimeout(this.attemptConnection, Math.min(30, Math.pow(2, this.connectionAttempts)) * 1000);
  };

  forwardMessageToEventHandlers = e => {
    this.sharedState.metrics.received++;
    const commaIndex = e.data.indexOf(',');
    if (commaIndex === -1) {
      logger.debug('Retrieved malformed WS message. Could not find a comma in the data');
      return;
    }

    let event;
    let data;
    try {
      event = e.data.substring(0, commaIndex);
      data = JSON.parse(e.data.substring(commaIndex + 1));
    } catch (e) {
      logger.debug('Retrieved malformed WS message.', e);
      return;
    }

    this.sharedState.events.emit(event, data);
  };
}
