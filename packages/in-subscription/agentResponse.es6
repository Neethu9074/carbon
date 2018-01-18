import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-agent-response',

  getId({ target, action, args }) {
    return target + action + JSON.stringify(args);
  },

  getData(subscriptionId, { target, action, args }) {
    return {
      subscriptionId,
      action,
      target,
      args
    };
  }
});
