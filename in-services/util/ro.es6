export function dispose(subscription) {
  if (subscription) {
    subscription.dispose();
  }
  return null;
}
