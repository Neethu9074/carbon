import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-snapshot-id-for-pid',

  getId({pid, hostSnapshot}) {
    return pid + JSON.stringify(hostSnapshot.get('entityId').toJS());
   },

  getData(subscriptionId, {pid, hostSnapshot}) {
    return {
      subscriptionId,
      pid: String(pid),
      entityId: hostSnapshot.get('entityId').toJS()
    };
  }
});
