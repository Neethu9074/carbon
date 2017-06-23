// {
//   <id>: {
//     subscriptionId
//     event: 'event to send to establish subscription'
//     payload: 'payload to be send to establish subscription'
//     lastData: 'last retrieved data point',
//     dataListener: 'function used to read data from socket',
//     isSubscribed: true|false
//   }
// }
export const activeSubscriptions = new Map();

// How long it takes until the subscriptions are disposed backend wise when the
// browser tab is no longer visible.
export const timeUntilDisposingSubscriptionsForHiddenUi = 1000 * 60;

// We want to reduce the overhead of channels on the network. Example: A metric
// subscription would need to include the hostId, plugin, steadyId, metric
// name and possibly other pieces of information in order to route messages.
// This is way too much overhead. We want to route messages based on a single
// numeric value. This is what these IDs are for. We include a single ID in
// server responses to reduce the overhead.
let idCounter = 0;
export function getNewSubscriptionId() {
  return idCounter++;
}
