import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-convert-hex-to-long',

  getId(hex) {
    return hex;
  },

  getData(subscriptionId, hex) {
    return {
      subscriptionId,
      hex
    };
  }
});
