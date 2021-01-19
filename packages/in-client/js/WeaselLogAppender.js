/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { ineum } from 'in-services/tracking/ineum';

let totalNumberOfReportedEvents = 0;

export default class WeaselLogAppender {
  constructor() {
    this.activePriority = 0;
  }

  append(opts) {
    // lots of stuff seems to go wrong, stop polluting our logs
    if (totalNumberOfReportedEvents >= 100) {
      return;
    }

    const error = opts.params.filter(p => p instanceof Error)[0];

    ineum('reportEvent', `log.${opts.severity.toLowerCase()}`, {
      error,
      meta: {
        logger: opts.name,
        logLevel: opts.severity,
        serverTimeInClient: window.instana.dev.storeStates.serverTime,
        message: opts.params.filter(p => typeof p === 'string')[0],
        params: opts.params
      }
    });

    totalNumberOfReportedEvents++;
  }

  getActivePriority() {
    return this.activePriority;
  }

  setActivePriority(priority) {
    this.activePriority = priority;
  }
}
