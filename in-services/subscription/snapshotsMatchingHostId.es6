import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-snapshots-for-host-id',

  getId({ snapshot, time }) {
    return JSON.stringify(snapshot.get('entityId').toJS()) + time;
  },

  getData: (subscriptionId, { snapshot, time }) => {
    return {
      subscriptionId,
      entityId: snapshot.get('entityId').toJS(),
      time
    };
  }
});
