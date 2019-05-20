import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-gravatar-url',

  getId(email) {
    return email;
  },

  getData(subscriptionId, email) {
    return {
      subscriptionId,
      email
    };
  }
});
