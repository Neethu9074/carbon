/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import createSubscription from 'in-subscription/subscription';
import { generateStableHash } from 'in-services/util/id';

export default createSubscription({
  eventId: 'subscribe-agent-snapshot-id',

  getId(snapshot) {
    return generateStableHash(snapshot.get('entityId').toJS());
  },

  getData(subscriptionId, snapshot) {
    return {
      subscriptionId,
      entityId: snapshot.get('entityId').toJS()
    };
  }
});
