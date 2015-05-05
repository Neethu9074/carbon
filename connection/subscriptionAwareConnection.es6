'use strict';

import invariant from 'invariant';
import * as connection from './index';

// we are exposing the emitter of the connection to maintain the interface of
// connection/index
export const emitter = connection.emitter;

// {
//   <id>: <data to be send to establish subscription>
// }
let subscriptions = {};

// automatically try to resend the subscriptions once the connection is closed
// (for whatever reason that may happen).
emitter.on('connected').subscribe(() => {
  Object.keys(subscriptions).forEach(k => send(subscriptions[k]));
});

export function send(msg) {
  connection.send(msg);
}

export function subscribe(id, subscription) {
  invariant(
    !(id in subscriptions),
    'Multiple subscriptions with the same id are not possible!'
  );

  subscription.event = 'subscribe';
  subscriptions[id] = subscription;

  // the queueing mechanism of connection is insufficient. We want to refresh
  // subscriptions once the connection is established, not on disconnect.
  if (connection.isOpen()) {
    send(subscription);
  }
}

export function unsubscribe(id) {
  const subscription = subscriptions[id];
  subscription.event = 'unsubscribe';
  delete subscriptions[id];
  send(subscription);
}
