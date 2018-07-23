// @flow

import createSubscription from 'in-subscription/subscription';
import type { Observable } from 'reactive-observables';

export type Message = {
  title: string,
  text: string,
  errorCode?: ErrorCode,
  subscriptionId?: number
};

const subscriptionFactory: () => Observable<Message> = createSubscription({
  eventId: 'subscribe-message',

  getId() {
    return 'messageSubscription';
  },

  getData(subscriptionId) {
    return {
      subscriptionId
    };
  }
});

export default subscriptionFactory;
