/* eslint-env mocha */

import {create} from 'reactive-observables';
import Immutable from 'immutable';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {expect} from 'chai';

describe('in-stores/events', () => {

  let mod;
  let subscriber;
  let from$;
  let to$;
  let timeframe$;
  let getEvents;
  let getEventsResult;
  let getEventUpdates;
  let getEventUpdatesResult;

  beforeEach(() => {
    subscriber = sinon.stub();
    timeframe$ = create().emit({
      to: null,
      windowSize: 1000 * 60 * 10
    });
    from$ = create();
    to$ = create();
    getEvents = sinon.stub();
    getEventsResult = create().emit(Immutable.List());
    getEvents.returns(getEventsResult);
    getEventUpdates = sinon.stub();
    getEventUpdatesResult = create();
    getEventUpdates.returns(getEventUpdatesResult);
    mod = proxyquire('in-stores/events', {
      'in-stores/timeline': {
        timeframe$,
        from$,
        to$
      },
      'in-services/subscription/eventUpdates': getEventUpdates,
      'in-services/subscription/events': getEvents
    });
  });

  describe('retrievedEvents$', () => {
    it('should work when there are no events', () => {
      mod.retrievedEvents$.subscribe(subscriber);
      const result = subscriber.getCall(0).args[0].issues;
      expect(result.length).to.equal(0);
    });

    it('should include historic data in aggregation', () => {
      getEventsResult.emit(Immutable.fromJS([{
        'id': 'foo',
        'start': 10,
        'end': 20,
        'state': 'closed',
        'type': 'issue'
      }]));

      mod.retrievedEvents$.subscribe(subscriber);

      const result = subscriber.getCall(0).args[0].issues;
      expect(result.length).to.equal(1);
      expect(result[0].time).to.equal(10);
      expect(result[0].get('id')).to.equal('foo');
    });

    it('should combine successive historic updates', () => {
      mod.retrievedEvents$.subscribe(subscriber);

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'foo',
        'start': 10,
        'end': 20,
        'state': 'closed',
        'type': 'issue'
      }]));

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'bar',
        'start': 5,
        'state': 'open',
        'type': 'issue'
      }]));

      const result = subscriber.getCall(1).args[0].issues;
      expect(result.length).to.equal(2);
      expect(result[0].time).to.equal(5);
      expect(result[0].get('id')).to.equal('bar');
      expect(result[1].time).to.equal(10);
      expect(result[1].get('id')).to.equal('foo');
    });

    it('should merge historic with live updates', () => {
      mod.retrievedEvents$.subscribe(subscriber);

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'foo',
        'start': 10,
        'end': 20,
        'state': 'closed',
        'type': 'issue'
      }]));

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'bar',
        'start': 5,
        'state': 'open',
        'type': 'issue'
      }]));

      const result = subscriber.getCall(1).args[0].issues;
      expect(result.length).to.equal(2);
      expect(result[0].time).to.equal(5);
      expect(result[0].get('id')).to.equal('bar');
      expect(result[1].time).to.equal(10);
      expect(result[1].get('id')).to.equal('foo');
    });

    it('should provide sorted events list', () => {
      mod.retrievedEvents$.subscribe(subscriber);

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'foo',
        'start': 10,
        'end': 20,
        'state': 'closed',
        'type': 'issue'
      }]));

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'bar',
        'start': 5,
        'state': 'open',
        'type': 'issue'
      }]));

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'pups',
        'start': 15,
        'end': 20,
        'state': 'closed',
        'type': 'issue'
      }]));

      const result = subscriber.getCall(2).args[0].issues;
      expect(result.length).to.equal(3);
      expect(result[0].time).to.equal(5);
      expect(result[0].get('id')).to.equal('bar');
      expect(result[1].time).to.equal(10);
      expect(result[1].get('id')).to.equal('foo');
      expect(result[2].time).to.equal(15);
      expect(result[2].get('id')).to.equal('pups');
    });

    it('should subscribe with selected timeframe', () => {
      mod.retrievedEvents$.subscribe(subscriber);
      expect(getEvents.getCall(0).args[0].to).to.equal(null);
      expect(getEvents.getCall(0).args[0].windowSize).to.equal(1000 * 60 * 10 * 2);
    });

    it('should resubscribe when selected timeframe changes', () => {
      mod.retrievedEvents$.subscribe(subscriber);
      timeframe$.emit({
        to: 30,
        windowSize: 10
      });
      expect(getEvents.getCall(1).args[0].to).to.equal(35);
      expect(getEvents.getCall(1).args[0].windowSize).to.equal(20);
    });

    it('should merge events in same time', () => {
      mod.retrievedEvents$.subscribe(subscriber);

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'foo',
        'start': 5,
        'end': 20,
        'state': 'closed',
        'type': 'issue'
      }]));

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'bar',
        'start': 5,
        'state': 'open',
        'type': 'issue'
      }]));

      const result = subscriber.getCall(2).args[0].issues;
      expect(result.length).to.equal(2);
      expect(result[0].get('id')).to.equal('bar');
      expect(result[1].get('id')).to.equal('foo');
    });

    it('should categorized events', () => {
      mod.retrievedEvents$.subscribe(subscriber);

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'foo',
        'start': 5,
        'end': 20,
        'state': 'closed',
        'type': 'change'
      }]));

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'pups',
        'start': 19,
        'end': 20,
        'state': 'closed',
        'type': 'incident'
      }]));

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'bar',
        'start': 15,
        'state': 'open',
        'type': 'issue'
      }]));

      const result = subscriber.getCall(3).args[0];
      expect(result.issues.length).to.equal(1);
      expect(result.issues[0].time).to.equal(15);
      expect(result.issues[0].get('id')).to.equal('bar');

      expect(result.incidents.length).to.equal(1);
      expect(result.incidents[0].time).to.equal(19);
      expect(result.incidents[0].get('id')).to.equal('pups');

      expect(result.changes.length).to.equal(1);
      expect(result.changes[0].time).to.equal(5);
      expect(result.changes[0].get('id')).to.equal('foo');
    });

    it('should update events', () => {
      mod.retrievedEvents$.subscribe(subscriber);

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'bar',
        'start': 15,
        'state': 'open',
        'type': 'issue'
      }]));

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'bar',
        'start': 15,
        'end': 20,
        'state': 'closed',
        'type': 'issue'
      }]));

      const result = subscriber.getCall(2).args[0];
      expect(result.issues.length).to.equal(1);
      expect(result.issues[0].time).to.equal(15);
      expect(result.issues[0].get('id')).to.equal('bar');
      expect(result.issues[0].get('end')).to.equal(20);
    });
  });

  describe('eventsInTimeframe$', () => {
    it('should only return events that are in the selected timeframe', () => {
      timeframe$.emit({
        to: 10,
        windowSize: 6
      });
      from$.emit(4);
      to$.emit(10);

      mod.eventsInTimeframe$.subscribe(subscriber);

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'foo',
        'start': 5,
        'end': 20,
        'state': 'closed',
        'type': 'issue'
      }]));

      getEventsResult.emit(Immutable.fromJS([{
        'id': 'pups',
        'start': 19,
        'end': 20,
        'state': 'closed',
        'type': 'issue'
      }]));

      const result = subscriber.getCall(2).args[0];
      expect(result.issues.length).to.equal(1);
      expect(result.issues[0].get('id')).to.equal('foo');
    });
  });

});
