import { connection } from 'in-services/connection';

export function subscribe(subscriptionId, event, payload, disposeSubscriptionOnDocumentHidden = true) {
  connection.subscribe({subscriptionId, event, payload, disposeSubscriptionOnDocumentHidden});
}

export function unsubscribe(subscriptionId) {
  connection.unsubscribe(subscriptionId);
}

export function getNewSubscriptionId() {
  return connection.getNewSubscriptionId();
}
