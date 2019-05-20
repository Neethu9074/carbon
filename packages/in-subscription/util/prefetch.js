const fiveMinutes = 1000 * 60 * 10;

export function prefetch(observable, time = fiveMinutes) {
  const subscription = observable.subscribe(() => {});
  setTimeout(() => subscription.dispose(), time);
}
