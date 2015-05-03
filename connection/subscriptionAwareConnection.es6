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
emitter.on('closed').subscribe(() => {
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

  const msg = subscriptions[id] = {
    event: 'subscribe',
    data: subscription
  };
  send(msg);
}

export function unsubscribe(id) {
  delete subscriptions[id];
  send({
    event: 'unsubscribe',
    data: {
      id
    }
  });
}
