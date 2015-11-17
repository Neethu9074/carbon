import * as connection from '../connection/subscriptionAwareConnection';
import {extractCoordinates} from '../snapshots';

export default class AggregatedIssuesConveyer {

  static getUniqueId({analysisWindow}) {
    return 'issueAggregation,' + analysisWindow;
  }

  constructor({analysisWindow}) {
    this.id = connection.getSubscriptionId();
    this.subscribeEvent = {
      id: this.id,
      event: 'subscribe',
      type: 'aggregated_issues',
      analysisWindow
    };
  }


  start(onNext) {
    this.onNext = onNext;
    this.subscription = connection.emitter.on('message')
      .filter(e => e.id === this.id)
      .scan((previousResult, event) => {
        return event.data.reduce((agg, aggregatedIssue) => {
          // fix consistent data format in backend
          aggregatedIssue.entity.hostId = aggregatedIssue.entity.host;
          aggregatedIssue.entity = extractCoordinates(aggregatedIssue.entity);
          const id = aggregatedIssue.entity.get('id');

          agg = agg.filter(eachAggregatedIssue => {
            return eachAggregatedIssue.entity.get('id') !== id;
          });

          // add new / updated aggregated issues
          if (aggregatedIssue.diminishedSeverity > 0) {
            agg.push(aggregatedIssue);
          }

          return agg;
        }, previousResult);
      }, [])
      .subscribe(onNext);

    connection.subscribe(this.id, this.subscribeEvent);
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }

}
