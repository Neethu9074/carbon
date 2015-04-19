'use strict';

import http from '../http';

export default class AbstractHttpConveyer {
  constructor({frequency}) {
    this.frequency = frequency;

    // we do not want to rebind this all the time in the run loop.
    this.run = this.run.bind(this);
  }

  start(onNext, onError) {
    this.running = true;
    this.onNext = onNext;
    this.onError = onError;
    this.run();
  }

  stop() {
    this.running = false;
  }

  run() {
    if (!this.running) return;

    http(this.getHttpRequestConfig())
    .then(response => {
      if (!this.running) return;
      const nextEvent = this.buildNextEvent(response);
      if (nextEvent !== false) {
        this.onNext(nextEvent);
      }
      setTimeout(this.run, this.frequency);
    }, error => {
      if (!this.running) return;
      this.onError(error);
      setTimeout(this.run, this.frequency);
    });
  }

  getHttpRequestConfig() {
    throw new Error('getHttpRequestConfig() is not implemented!');
  }

  buildNextEvent(response) {
    throw new Error('buildNextEvent() is not implemented!', response);
  }
}
