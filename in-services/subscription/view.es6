import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-view',

  getId({viewType, time, grouping}) {
    return viewType + time + grouping;
  },

  getData(subscriptionId, {viewType, time, grouping}) {
    return {
      subscriptionId,
      viewType,
      time,
      grouping
    };
  },

  transformData
});

function transformData(view) {
  return view;
}
