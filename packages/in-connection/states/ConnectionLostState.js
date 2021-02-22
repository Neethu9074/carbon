/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createLogger } from '@instana/logger';
import SockJS from 'sockjs-client';
import { t } from 'in-i18n';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import AbstractState from 'in-connection/states/AbstractState';
import { combineDataAndError } from 'in-services/util/ro';
import { ineum } from 'in-services/tracking/ineum';
import { minutes } from 'in-services/time/time';
import { isSignedIn } from 'in-api/account';

const logger = createLogger('connection/states/ConnectionLostState');

const transports = ['websocket', 'xhr-polling'];

// Do not track the initial enter call as connection lost
let isInitialEnter = true;

export default class ConnectionLostState extends AbstractState {
  onEnter() {
    if (isInitialEnter) {
      isInitialEnter = false;
    } else {
      ineum('reportEvent', 'connection.lost', {
        meta: {
          transport: this.sharedState.socket?.transport,
          socketRto: this.sharedState.socket?._rto
        }
      });
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
          title: t('in-connection:stat.connectLostState.connecting'),
          content: t('in-connection:stat.connectLostState.connectingMsg', { connectAttempt: this.connectionAttempts })
        },
        'connectionStatus'
      );
    } else if (!this.isFirstEverConnectionAttempt) {
      addMessage(
        {
          type: 'warning',
          title: t('in-connection:stat.connectLostState.connecting'),
          content: t('in-connection:stat.connectLostState.connectLostAttempReconnect')
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
            title: t('in-connection:stat.connectLostState.unauthorized'),
            content: t('in-connection:stat.connectLostState.unauthorizedMsg')
          },
          'connectionStatus'
        );
      } else {
        this.sharedState.socket = new SockJS('/api/data', null, {
          transports,
          // Number of characters used for the randomly generated session IDs
          sessionId: 16,
          // Minimum! timeout for connection establishment. Value can be higher when the RTT
          // measured for the info XHR call is quite large.
          //
          // The default value is 5s
          timeout: minutes.toMillis(1)
        });
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
    ineum('reportEvent', 'connection.established', {
      meta: {
        transport: this.sharedState.socket?.transport,
        socketRto: this.sharedState.socket?._rto
      }
    });
    this.transitionTo('connected');
  };

  sendConnectionSettings() {
    this.send('setConnectionSettings', {});
  }

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
