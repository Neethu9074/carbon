/* eslint-env mocha */

import {create} from 'reactive-observables';
import Immutable from 'immutable';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {expect} from 'chai';

describe('in-components/timeline/eventsStore', () => {

  let mod;
  let subscriber;
  let timeframe$;
  let getHistoricalEvents;
  let getHistoricalEventsResult;
  let getEventUpdates;
  let getEventUpdatesResult;

  beforeEach(() => {
    subscriber = sinon.stub();
    timeframe$ = create().emit({
      to: null,
      windowSize: 1000 * 60 * 10
    });
    getEventUpdates = sinon.stub();
    getEventUpdatesResult = create();
    getEventUpdates.returns(getEventUpdatesResult);
    getHistoricalEvents = sinon.stub();
    getHistoricalEventsResult = create().emit([]);
    getHistoricalEvents.returns(getHistoricalEventsResult);
    mod = proxyquire('in-components/timeline/eventsStore', {
      'in-stores/timeline': {
        timeframe$
      },
      'in-stores/events': {
        getHistoricalEvents,
        getEventUpdates
      }
    });
  });

  describe('eventsAroundTimeframe$', () => {
    it('should work when there are no events', () => {
      mod.eventsAroundTimeframe$.subscribe(subscriber);
      const result = subscriber.getCall(0).args[0];
      expect(result.length).to.equal(0);
    });

    it('should include historic data in aggregation', () => {
      getHistoricalEventsResult.emit(Immutable.fromJS({
        'id': 'foo',
        'start': 10,
        'end': 20,
        'state': 'closed'
      }));

      mod.eventsAroundTimeframe$.subscribe(subscriber);

      const result = subscriber.getCall(0).args[0];
      expect(result.length).to.equal(1);
      expect(result[0].time).to.equal(10);
      expect(result[0][0].get('id')).to.equal('foo');
    });
  });

});
