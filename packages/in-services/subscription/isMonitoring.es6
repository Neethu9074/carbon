import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-is-monitoring',

  getId: () => 'isMonitoring',

  getData: subscriptionId => {
    return {
      subscriptionId
    };
  },

  transformData: monitoring => monitoring
});
