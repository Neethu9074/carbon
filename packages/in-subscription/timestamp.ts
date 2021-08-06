/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createSubscription from 'in-subscription/subscription';

export interface TimestampEvent {
  originate: number;
}

export interface TimestampReply {
  originate: number;
  receive: number;
  transmit: number;
}

export default createSubscription<TimestampEvent, TimestampReply>({
  eventId: 'timestamp',

  getId({ originate }: TimestampEvent) {
    return String(originate);
  },

  // Disable memoization. This is actually a simple RPC call.
  memoizeFor: 0,

  getData(subscriptionId, { originate }: TimestampReply) {
    return {
      subscriptionId,
      originate
    };
  }
});
