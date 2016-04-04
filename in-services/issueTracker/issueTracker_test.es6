/* eslint-env mocha */
/* eslint-disable max-len*/
/* global global:false */
import * as ro from 'reactive-observables';
import proxyquire from 'proxyquire';
import Immutable from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';
import {theme} from 'in-services/theme';


global.requestAnimationFrame = function requestAnimationFrame(fn) {
  fn();
};

describe('issueTracker', () => {

  let historicalEventObservable;
  let historicalEventsStubData;
  let openEventsObservable;
  let openEventsStubData;
  let issueTracker;

  beforeEach(() => {
    resetStoreRegistry();

    historicalEventObservable = ro.create();
    openEventsObservable = ro.create();

    /* eslint-disable camelcase, no-underscore-dangle, no-undef */
    global.__DEV__ = false;
    global.window = global.window || {};
    global.window.instana = {
      config: {
        environment: 'production'
      }
    };
    /* eslint-enable camelcase, no-underscore-dangle, no-undef */

    const historicalEventsStreamstub = sinon.stub();
    historicalEventsStreamstub.returns(historicalEventObservable);

    const openEventsStreamstub = sinon.stub();
    openEventsStreamstub.returns(openEventsObservable);

    issueTracker = proxyquire('./issueTracker', {
      'in-stores/historicalEvents': { getHistoricalEvents: historicalEventsStreamstub },
      'in-stores/openEvents': { getOpenEvents: openEventsStreamstub }
    });

    openEventsStubData = Immutable.fromJS([{
        'id': 'oi1',
        'start': 1433251409977
      }, {
        'id': 'oi2',
        'start': 1433251409977
      }
    ]);

    historicalEventsStubData = Immutable.fromJS([{
        'id': 'hi1',
        'start': 1433251400000,
        'end': 1433251500000
      }
    ]);
  });

  describe('getOpenEvents', () => {

    it('should send initial data', () => {
      let openEvents;
      issueTracker.openEvents$.subscribe(events => openEvents = events.toJS());
      openEventsObservable.emit(openEventsStubData);

      expect(openEvents.length).to.equal(2);
      expect(openEvents[0].id).to.equal('oi1');
      expect(openEvents[1].id).to.equal('oi2');
    });

    it('should send updates', () => {
      let openEvents;
      issueTracker.openEvents$.subscribe(events => openEvents = events.toJS());
      openEventsObservable.emit(openEventsStubData);
      openEventsObservable.emit(Immutable.fromJS([{
        'id': 'oi_new',
        'start': 1433251409977
      }]));

      expect(openEvents.length).to.equal(3);
      expect(openEvents[0].id).to.equal('oi1');
      expect(openEvents[1].id).to.equal('oi2');
      expect(openEvents[2].id).to.equal('oi_new');
    });

    it('should remove updated events that are now historical', () => {
      let openEvents;
      issueTracker.openEvents$.subscribe(events => openEvents = events.toJS());
      openEventsObservable.emit(openEventsStubData);
      openEventsObservable.emit(Immutable.fromJS([{
        'id': 'oi2',
        'start': 1433251409977,
        'end': 1433251500000
      }]));

      expect(openEvents.length).to.equal(1);
      expect(openEvents[0].id).to.equal('oi1');
    });

    it('should add and remove events', () => {
      let openEvents;
      issueTracker.openEvents$.subscribe(events => openEvents = events.toJS());
      openEventsObservable.emit(openEventsStubData);
      expect(openEvents.length).to.equal(2);
      expect(openEvents[0].id).to.equal('oi1');
      expect(openEvents[1].id).to.equal('oi2');

      openEventsObservable.emit(Immutable.fromJS([{
        'id': 'oi2',
        'start': 1433251409977,
        'end': 1433251500000
      }]));

      expect(openEvents.length).to.equal(1);
      expect(openEvents[0].id).to.equal('oi1');

      openEventsObservable.emit(Immutable.fromJS([{
        'id': 'oi2',
        'start': 1433251409977
      }]));
      expect(openEvents.length).to.equal(2);
      expect(openEvents[0].id).to.equal('oi1');
      expect(openEvents[1].id).to.equal('oi2');

      openEventsObservable.emit(Immutable.fromJS([{
        'id': 'oi2',
        'start': 1433251409977,
        'end': 1433251500000
      }]));

      expect(openEvents.length).to.equal(1);
      expect(openEvents[0].id).to.equal('oi1');

      openEventsObservable.emit(Immutable.fromJS([{
        'id': 'oi1',
        'start': 1433251409977,
        'end': 1433251500000
      }]));

      expect(openEvents.length).to.equal(0);

      openEventsObservable.emit(Immutable.fromJS([{
        'id': 'oi1',
        'start': 1433251409977
      }]));

      expect(openEvents.length).to.equal(1);
      expect(openEvents[0].id).to.equal('oi1');
    });

  });

  describe('getHistoricalEvents', () => {

    it('should send initial data', () => {
      let historicalEvents;
      issueTracker.historicalEvents$.subscribe(events => historicalEvents = events.toJS());
      historicalEventObservable.emit(historicalEventsStubData);

      expect(historicalEvents.length).to.equal(1);
      expect(historicalEvents[0].id).to.equal('hi1');
    });

  });

  describe('getCombinedEvents', () => {

    it('should combine both, historical and open events', () => {
      let combinedEvents;
      issueTracker.combinedEvents$.subscribe(events => combinedEvents = events.toJS());
      historicalEventObservable.emit(historicalEventsStubData);
      openEventsObservable.emit(openEventsStubData);

      expect(combinedEvents.length).to.equal(3);
      expect(combinedEvents[0].id).to.equal('hi1');
      expect(combinedEvents[1].id).to.equal('oi1');
      expect(combinedEvents[2].id).to.equal('oi2');
    });

  });

  describe('getColorForEvent', () => {

    it('should throw an error if there is no given event', () => {
      expect(() => issueTracker.getColorForEvent(undefined)).to.throw(Error);
    });

    it('should return ok color on closed events', () => {
      let event = Immutable.fromJS({
        problem: {
          severity: 0
        },
        type: 'issue'
      });
      expect(issueTracker.getColorForEvent(event)).to.equal(theme.health[0]);

      event = event.setIn(['problem', 'severity'], 5);
      expect(issueTracker.getColorForEvent(event)).to.equal(theme.health[5]);

      event = event.setIn(['problem', 'severity'], 10);
      expect(issueTracker.getColorForEvent(event)).to.equal(theme.health[10]);
    });

    it('should return default color for closed events', () => {
      let event = Immutable.fromJS({
        problem: {
          severity: 0
        },
        end: 42,
        type: 'issue'
      });
      expect(issueTracker.getColorForEvent(event)).to.equal(theme.health[0]);

      event = event.setIn(['problem', 'severity'], 5);
      expect(issueTracker.getColorForEvent(event)).to.equal(theme.health[0]);

      event = event.setIn(['problem', 'severity'], 10);
      expect(issueTracker.getColorForEvent(event)).to.equal(theme.health[0]);
    });

  });

  describe('getMostImportantEvent', () => {

    it('should return the most important event if there are multiple events for the same entity', () => {
      let mostImportantEvent;
      issueTracker.getMostImportantEvent('123').subscribe(event => mostImportantEvent = event);

      openEventsObservable.emit(Immutable.fromJS([{
          'id': 'oi1',
          'problem': {
            'snapshotId': '123',
            'severity': 5
          },
          'start': 1433251409977
        }, {
          'id': 'oi2',
          'problem': {
            'snapshotId': '123',
            'severity': 10
          },
          'start': 1433251409977
        }, {
          'id': 'oi3',
          'problem': {
            'snapshotId': '123',
            'severity': 3
          },
          'start': 1433251409977
        }
      ]));

      expect(mostImportantEvent.get('id')).to.equal('oi2');
    });

    it('should return the only event if there is only one', () => {
      let mostImportantEvent;
      issueTracker.getMostImportantEvent('123').subscribe(event => mostImportantEvent = event);

      openEventsObservable.emit(Immutable.fromJS([{
          'id': 'oi1',
          'problem': {
            'snapshotId': '123',
            'severity': 0
          },
          'start': 1433251409977
        }
      ]));

      expect(mostImportantEvent.get('id')).to.equal('oi1');
    });

    it('should return nothing if there are no events', () => {
      let mostImportantEvent;
      issueTracker.getMostImportantEvent('123').subscribe(event => mostImportantEvent = event);

      openEventsObservable.emit(Immutable.fromJS([]));

      expect(mostImportantEvent).to.equal(undefined);
    });

  });

});
