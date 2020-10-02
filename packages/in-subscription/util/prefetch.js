import { minutes } from 'in-services/time';

const defaultTime = minutes.toMillis(10);
export function prefetch(observable, time = defaultTime) {
  const subscription = observable.subscribe(() => {});
  setTimeout(() => subscription.dispose(), time);
}
