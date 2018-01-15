import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'get-services',

  getId() {
    return 'some-weird-string';
  },

  getData(subscriptionId) {
    return {
      subscriptionId,
      filter: {
        applicationName: 'fail'
      },
      pagination: null,
      orderBy: null,
      metrics: null
    };
  }
});
