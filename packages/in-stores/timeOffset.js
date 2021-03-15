/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { interval, range } from '@instana/observables';

import synchronizeTime from 'in-subscription/timestamp';
import { createStore } from 'in-stores/store';
import { connection } from 'in-connection';
import { seconds } from 'in-services/time';

// This is an attempt to "synchronize" the time between client (browser) and
// server (backend). This needs to be done as we cannot expect that the user
// has correctly configured its local time. Also, we need this information in
// order to interpret the report times in issues and charts as those are
// represented in server time.
//
// While this is not a complete solution to this problem, this module enables
// the discovery of a rough offset between client and server time, but it is
// succeptible to latency. Luckily this is not a big issue for us as an
// accuracy of a few seconds can hardly be noticed by humans for this specific
// use case.
//
// This approach is based on
// http://stackoverflow.com/questions/8478179/synchronize-time-in-javascript-with-a-good-precision-0-5s-ntp-like

// the number of milliseconds between each synchronization
const syncInterval = seconds.toMillis(10);

// number of offsets that should be used to calculate the time offset
const numberOfValuesForOffetMean = 5;

// How many consecutive synchronization attempts should be made whenever a
// new connection is established.
const numberOfSynchronizationAttemptOnceConnected = 3;

let subscription;

// in the beginning we do not know the time offset. We will try to synchronize
// regularly and we will use the mean of multiple attempts.
//
// A value in milliseconds
// Positive values indicate that the local clock is ahead of the server clock.
// Negative values indicate that the local click is behing the server clock.
let offsets = [];

const offsetStore = createStore({
  name: 'timeOffsetMillis',
  initialValue: 0
});
export const offset = offsetStore.observable;
export const offset$ = offset;

export function init() {
  connection.on('open', start);
  connection.on('close', stop);
}

/**
 * Translate local time to server time by subtracting the offset
 *
 * @param {number|Date} d The value which should be translated to server time.
 * @param {number} off The current offset to the server time in millis
 * @returns {number} The provided time in milliseconds server time.
 */
export function toServerTime(d, off) {
  let millis;
  if (d instanceof Date) {
    millis = d.getTime();
  } else {
    millis = d;
  }
  return millis - off;
}

function start() {
  stop();

  subscription = interval(syncInterval)
    // Do not execute when window is hidden. The browser tab will be executed at
    // lower priority and this will skew the time synchronization results.
    .nextFrame()
    .merge(range(numberOfSynchronizationAttemptOnceConnected))
    .flatMap(() => synchronizeTime({ originate: Date.now() }))
    .subscribe(processTimestampReply);
}

function stop() {
  if (subscription) {
    subscription.dispose();
    subscription = null;
  }
}

/**
 * Process the server reply and try to get an offset approximation. This only works
 * reliably when the request latency is mostly stable.
 *
 * Example:
 * clock skew client->server: +50ms
 * clock skew server->client: -50ms
 * latency: 10ms
 * sending = latency + client->server = +60ms
 * receiving = latency + server->client = -40ms
 * rountrip = sending + receiving = 20ms
 * latency = roundtrip / 2
 * time difference = receiving - latency = -50ms
 *
 * @param {object} reply An object with originate, transmit and receive
 *   timestamps as retrieved by the server.
 */
function processTimestampReply(reply) {
  const returned = Date.now();
  const sending = reply.receive - reply.originate;
  const receiving = returned - reply.transmit;
  const roundtrip = sending + receiving;
  const latency = roundtrip / 2;
  const difference = receiving - latency;
  offsets.push(difference);
  offsets = offsets.slice(offsets.length - numberOfValuesForOffetMean, offsets.length);
  offsetStore.applyStateMutation(() => getOffset());
}

/**
 * Returns the number of milliseconds that the local clock differs from the
 * remote click.
 *
 * Positive values indicate that the local clock is ahead of the server clock.
 * Negative values indicate that the local click is behing the server clock.
 *
 * @returns {number} Difference in milliseconds.
 */
function getOffset() {
  const offsetSum = offsets.reduce((a, b) => a + b, 0);
  return Math.round(offsetSum / Math.max(offsets.length, 1));
}
