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
      getHistoricalEventsResult.emit([Immutable.fromJS({
        'id': 'foo',
        'start': 10,
        'end': 20,
        'state': 'closed'
      })]);

      mod.eventsAroundTimeframe$.subscribe(subscriber);

      const result = subscriber.getCall(0).args[0];
      expect(result.length).to.equal(1);
      expect(result[0].time).to.equal(10);
      expect(result[0][0].get('id')).to.equal('foo');
    });

    it('should combine successive historic updates', () => {
      mod.eventsAroundTimeframe$.subscribe(subscriber);

      getHistoricalEventsResult.emit([Immutable.fromJS({
        'id': 'foo',
        'start': 10,
        'end': 20,
        'state': 'closed'
      })]);

      getHistoricalEventsResult.emit([Immutable.fromJS({
        'id': 'bar',
        'start': 5,
        'state': 'open'
      })]);

      const result = subscriber.getCall(1).args[0];
      expect(result.length).to.equal(2);
      expect(result[0].time).to.equal(5);
      expect(result[0][0].get('id')).to.equal('bar');
      expect(result[1].time).to.equal(10);
      expect(result[1][0].get('id')).to.equal('foo');
    });

    it('should merge historic with live updates', () => {
      mod.eventsAroundTimeframe$.subscribe(subscriber);

      getEventUpdatesResult.emit(Immutable.fromJS({
        'id': 'foo',
        'start': 10,
        'end': 20,
        'state': 'closed'
      }));

      getHistoricalEventsResult.emit([Immutable.fromJS({
        'id': 'bar',
        'start': 5,
        'state': 'open'
      })]);

      const result = subscriber.getCall(1).args[0];
      expect(result.length).to.equal(2);
      expect(result[0].time).to.equal(5);
      expect(result[0][0].get('id')).to.equal('bar');
      expect(result[1].time).to.equal(10);
      expect(result[1][0].get('id')).to.equal('foo');
    });

    it('should provide sorted events list', () => {
      mod.eventsAroundTimeframe$.subscribe(subscriber);

      getEventUpdatesResult.emit(Immutable.fromJS({
        'id': 'foo',
        'start': 10,
        'end': 20,
        'state': 'closed'
      }));

      getHistoricalEventsResult.emit([Immutable.fromJS({
        'id': 'bar',
        'start': 5,
        'state': 'open'
      })]);

      getEventUpdatesResult.emit(Immutable.fromJS({
        'id': 'pups',
        'start': 15,
        'end': 20,
        'state': 'closed'
      }));

      const result = subscriber.getCall(2).args[0];
      expect(result.length).to.equal(3);
      expect(result[0].time).to.equal(5);
      expect(result[0][0].get('id')).to.equal('bar');
      expect(result[1].time).to.equal(10);
      expect(result[1][0].get('id')).to.equal('foo');
      expect(result[2].time).to.equal(15);
      expect(result[2][0].get('id')).to.equal('pups');
    });

    it('should subscribe with selected timeframe', () => {
      mod.eventsAroundTimeframe$.subscribe(subscriber);
      expect(getHistoricalEvents.getCall(0).args[0].to).to.equal(null);
      expect(getHistoricalEvents.getCall(0).args[0].windowSize).to.equal(1000 * 60 * 10 * 2);
    });

    it('should resubscribe when selected timeframe changes', () => {
      mod.eventsAroundTimeframe$.subscribe(subscriber);
      timeframe$.emit({
        to: 30,
        windowSize: 10
      });
      expect(getHistoricalEvents.getCall(1).args[0].to).to.equal(35);
      expect(getHistoricalEvents.getCall(1).args[0].windowSize).to.equal(20);
    });

    it('should merge events in same time', () => {
      mod.eventsAroundTimeframe$.subscribe(subscriber);

      getEventUpdatesResult.emit(Immutable.fromJS({
        'id': 'foo',
        'start': 5,
        'end': 20,
        'state': 'closed'
      }));

      getHistoricalEventsResult.emit([Immutable.fromJS({
        'id': 'bar',
        'start': 5,
        'state': 'open'
      })]);

      const result = subscriber.getCall(2).args[0];
      expect(result.length).to.equal(1);
      expect(result[0].time).to.equal(5);
      expect(result[0][0].get('id')).to.equal('foo');
      expect(result[0][1].get('id')).to.equal('bar');
    });
  });

});
