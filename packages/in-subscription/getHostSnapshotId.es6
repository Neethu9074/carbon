import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-host-snapshot-id',

  getId(snapshot) {
    return JSON.stringify(snapshot.get('entityId').toJS());
  },

  getData(subscriptionId, snapshot) {
    return {
      subscriptionId,
      entityId: snapshot.get('entityId').toJS()
    };
  }
});
