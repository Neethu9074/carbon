/* eslint-env mocha */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import Immutable from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';

import {setTimeframe} from 'in-stores/timeline';


describe('timeline/timelineStores', () => {
  const historicalEvent1 = {
    'id': 'hi',
    'problem': {
      'id': 'hp',
      'severity': 5
    },
    'start': 50,
    'end': 60
  };

  const openEvent1 = {
    'id': 'oi',
    'problem': {
      'id': 'op',
      'severity': 10
    },
    'start': 50
    // no end == state : OPEN
  };

  const openEvent2 = {
    'id': 'oi2',
    'problem': {
      'id': 'op2',
      'severity': 10
    },
    'start': 100000 // somewhere in future
    // no end == state : OPEN
  };

  const historicalEventsStream = create().startWith(Immutable.fromJS([
    historicalEvent1,
    openEvent1
  ]));

  const openEventsStream = create().startWith(Immutable.fromJS([
    openEvent1,
    openEvent2
  ]));

  const stores = proxyquire('./timelineStores', {
    'in-services/issueTracker': {
      historicalEvents$: historicalEventsStream,
      openEvents$: openEventsStream
    }
  });

  let callback;
  beforeEach(() => {
    callback = sinon.stub();
  });

  it('should contain the correct elements', () => {
    let historicalEvents;
    historicalEventsStream.subscribe(i => historicalEvents = i.toJS());

    let openEvents;
    openEventsStream.subscribe(i => openEvents = i.toJS());

    expect(historicalEvents.length).to.equal(2);
    expect(historicalEvents[0].id).to.equal('hi');
    expect(historicalEvents[1].id).to.equal('oi');

    expect(openEvents.length).to.equal(2);
    expect(openEvents[0].id).to.equal('oi');
    expect(openEvents[1].id).to.equal('oi2');
  });

  it('should send initial value', () => {
    stores.selectedTimeRange.subscribe(callback);

    expect(callback).to.have.callCount(1); // inital value
    expect(callback).to.have.been.calledWith(stores.TIME_RANGES.LIVE);
  });

  it('should send live view if there is no to-property defined in timerange', () => {
    stores.selectedTimeRange.subscribe(callback);

    setTimeframe(100);
    expect(callback).to.have.callCount(2);
    expect(callback).to.have.been.calledWith(stores.TIME_RANGES.LIVE);
  });

  it('should send live view if there is a to-property defined in timerange', () => {
    stores.selectedTimeRange.subscribe(callback);

    setTimeframe(100, 200);
    expect(callback).to.have.callCount(2);
    expect(callback).to.have.been.calledWith(stores.TIME_RANGES.FIXED);
  });

  it('should switch events stream to historical events, based on the timerange', () => {
    let historicalEvents;
    stores.event$.subscribe(i => historicalEvents = i.toJS());

    setTimeframe(100, 100); // from 0 to 100
    expect(historicalEvents.length).to.equal(2);
    expect(historicalEvents[0].id).to.equal('hi');
    expect(historicalEvents[1].id).to.equal('oi');
  });

});
