const trackers = [];

export function registerTracker(tracker) {
  trackers.push(tracker);
}

export function track(event, props) {
  trackers.forEach(fn => fn(event, props));
}
