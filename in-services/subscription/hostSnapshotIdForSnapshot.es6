import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-host-snapshost-id',

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
