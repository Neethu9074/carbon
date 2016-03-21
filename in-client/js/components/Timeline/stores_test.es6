/* eslint-env mocha */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import Immutable from 'Immutable';
import {expect} from 'chai';
import sinon from 'sinon';

import {setTimeframe} from 'in-stores/timeline';


describe('timeline/stores', () => {
  const historicalIssue1 = {
    'id': 'hi',
    'problem': {
      'id': 'hp',
      'severity': 5
    },
    'start': 50,
    'end': 60
  };

  const openIssue1 = {
    'id': 'oi',
    'problem': {
      'id': 'op',
      'severity': 10
    },
    'start': 50
    // no end == state : OPEN
  };

  const openIssue2 = {
    'id': 'oi2',
    'problem': {
      'id': 'op2',
      'severity': 10
    },
    'start': 100000 // somewhere in future
    // no end == state : OPEN
  };

  const historicalIssuesStream = create().startWith(Immutable.fromJS([
    historicalIssue1,
    openIssue1
  ]));

  const openIssuesStream = create().startWith(Immutable.fromJS([
    openIssue1,
    openIssue2
  ]));

  const stores = proxyquire('./stores', {
    'in-services/issueTracker': {
      getHistoricalIssuesStream: () => historicalIssuesStream,
      getOpenIssuesStream: () => openIssuesStream
    }
  });

  let callback;
  beforeEach(() => {
    callback = sinon.stub();
  });

  it('should contain the correct elements', () => {
    let historicalIssues;
    historicalIssuesStream.subscribe(i => historicalIssues = i.toJS());

    let openIssues;
    openIssuesStream.subscribe(i => openIssues = i.toJS());

    expect(historicalIssues.length).to.equal(2);
    expect(historicalIssues[0].id).to.equal('hi');
    expect(historicalIssues[1].id).to.equal('oi');

    expect(openIssues.length).to.equal(2);
    expect(openIssues[0].id).to.equal('oi');
    expect(openIssues[1].id).to.equal('oi2');
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

  it('should switch issues stream to historical issues, based on the timerange', () => {
    let historicalIssues;
    stores.issue$.subscribe(i => historicalIssues = i.toJS());

    setTimeframe(100, 100); // from 0 to 100
    expect(historicalIssues.length).to.equal(2);
    expect(historicalIssues[0].id).to.equal('hi');
    expect(historicalIssues[1].id).to.equal('oi');
  });

  it('should switch issues stream to combined issues, based on the timerange', () => {
    let combinedIssues;
    stores.issue$.subscribe(i => combinedIssues = i.toJS());

    setTimeframe(100); // all open for the last 100
    expect(combinedIssues.length).to.equal(3);
    expect(combinedIssues[0].id).to.equal('hi');
    expect(combinedIssues[1].id).to.equal('oi');
    expect(combinedIssues[2].id).to.equal('oi2');
  });

});
