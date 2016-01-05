import Immutable from 'immutable';

import * as connection from '../connection/subscriptionAwareConnection';

import {isExperimentsEnabled} from '../config';

const experimentsEnabled = isExperimentsEnabled();

export default class IssueConveyer {

  static getUniqueId({timeframe}) {
    return 'issue,' + timeframe;
  }

  constructor({timeframe}) {
    this.id = connection.getSubscriptionId();
    this.subscribeEvent = {
      id: this.id,
      event: 'subscribe',
      type: 'issue',
      timeframe
    };
  }

  start(onNext) {
    this.subscription = connection.emitter.on('message')
      .filter(e => e.id === this.id)
      .subscribe(e => {
        let issues = e.data;

        if (!experimentsEnabled) {
          issues = issues.filter(issue => !issue.problem.experimental);
        }

        onNext(Immutable.fromJS(issues));
      });

    connection.subscribe(this.id, this.subscribeEvent);
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }

}
