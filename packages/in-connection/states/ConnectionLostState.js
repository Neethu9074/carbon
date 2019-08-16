import { createLogger } from 'instalog';
import SockJS from 'sockjs-client';

import { track, CONNECTION_LOST, CONNECTION_ESTABLISHED } from 'in-services/tracking/tracking';
import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import AbstractState from 'in-connection/states/AbstractState';
import { combineDataAndError } from 'in-services/util/ro';
import { isSafari } from 'in-services/browser';
import { isSignedIn } from 'in-api/account';

const logger = createLogger('connection/states/ConnectionLostState');

const transports = {
  efficient: ['websocket'],
  widelySupported: ['xhr-polling', 'xhr-streaming']
};
// Safari does not support WebSocket connections with invalid SSL certs
const bestAvailableTransport = __DEV__ && isSafari() ? transports.widelySupported : transports.efficient;

export default class ConnectionLostState extends AbstractState {
  onEnter() {
    track(CONNECTION_LOST, {
      transport: this.sharedState.socket ? this.sharedState.socket.transport : undefined
    });
    // Assume that WS connection is not possible when quickly reentering
    // the connection lost step.
    if (this.lastEnterTime >= Date.now() - 3000) {
      this.transport = transports.widelySupported;
    } else {
      this.transport = bestAvailableTransport;
    }
    this.lastEnterTime = Date.now();

    this.on('open', this.onOpen);
    this.on('close', this.onClose);
    this.sharedState.subscriptions.forEach(this.markSubscriptionDescriptionAsUnsubscribed, this);

    this.isFirstEverConnectionAttempt = true;
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
    this.sharedState.metrics.connectionAttempts++;
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
          content: `Connection attempt ${
            this.connectionAttempts
          } failed. Continuing to retry to establish persistent backend connection.`
        },
        'connectionStatus'
      );
    } else if (!this.isFirstEverConnectionAttempt) {
      addMessage(
        {
          type: 'warning',
          title: 'Connecting…',
          content: `Connection lost. Attempting reconnect…`
        },
        'connectionStatus'
      );
    }
    this.isFirstEverConnectionAttempt = false;

    combineDataAndError(isSignedIn()).once(({ data: isSignedIn, error }) => {
      if (error) {
        this.onClose();
      } else if (!isSignedIn) {
        addMessage(
          {
            type: 'danger',
            title: 'Unauthorized…',
            content: `Cannot establish persistent backend connection as you are unauthorized. Please refresh the page to continue.`
          },
          'connectionStatus'
        );
      } else {
        this.sharedState.socket = new SockJS('/api/data', null, { transports: this.transport });
        this.sharedState.socket.onopen = () => this.sharedState.events.emit('open');
        this.sharedState.socket.onclose = e => {
          logger.debug('Persistent connection closed', e);
          this.sharedState.events.emit('close');
        };
        this.sharedState.socket.onmessage = this.forwardMessageToEventHandlers;
      }
    });
  };

  onOpen = () => {
    removeMessage('connectionStatus');
    this.sendConnectionSettings();
    track(CONNECTION_ESTABLISHED, {
      transport: this.sharedState.socket ? this.sharedState.socket.transport : undefined
    });
    this.transitionTo('connected');
  };

  sendConnectionSettings() {
    this.send('setConnectionSettings', {});
  }

  onClose = () => {
    this.transport = transports.widelySupported;
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
