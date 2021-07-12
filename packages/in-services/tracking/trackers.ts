/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export type Tracker = (event: string, props?: Object) => void;

const trackers: Array<Tracker> = [];

export function registerTracker(tracker: Tracker) {
  trackers.push(tracker);
}

export function track(event: string, props?: Object) {
  trackers.forEach(fn => fn(event, props));
}
