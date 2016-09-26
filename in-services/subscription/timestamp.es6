import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'timestamp',

  getId: ({originate}) => originate,

  getData: (subscriptionId, {originate}) => {
    return {
      subscriptionId,
      originate
    };
  },

  transformData: reply => reply
});
