import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'timestamp',

  getId({ originate }) {
    return originate;
  },

  getData(subscriptionId, { originate }) {
    return {
      subscriptionId,
      originate
    };
  }
});
