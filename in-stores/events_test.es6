/* eslint-env mocha */

import { create } from 'reactive-observables';
import { fromJS, List } from 'immutable';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { resetStoreRegistry } from 'in-stores/store';
import { getColorBySeverity } from 'in-stores/events';

describe('in-stores/events', () => {
  let mod;
  let subscriber;
  let from$;
  let to$;
  let timeframe$;
  let getEvents;
  let serverTime$;
  let focusedMoment$;
  let resolvedFocusedMoment$;
  let getEventsResult;
  let getEventUpdates;
  let getEventUpdatesResult;
  let getTotalEventsCount;

  beforeEach(() => {
    resetStoreRegistry();

    subscriber = sinon.stub();
    timeframe$ = create().emit({
      to: null,
      windowSize: 1000 * 60 * 10
    });
    from$ = create();
    to$ = create();
    serverTime$ = create();
    getEvents = sinon.stub();
    getEventsResult = create().emit(List());
    focusedMoment$ = create();
    getTotalEventsCount = create();
    resolvedFocusedMoment$ = focusedMoment$.flatMap(focusedMoment => {
      if (focusedMoment == null) {
        return serverTime$;
      }
      return focusedMoment$;
    });
    getEvents.returns(getEventsResult);
    getEventUpdates = sinon.stub();
    getEventUpdatesResult = create();
    getEventUpdates.returns(getEventUpdatesResult);
    mod = proxyquire('in-stores/events', {
      'in-stores/timeline': {
        timeframe$,
        from$,
        to$,
        focusedMoment$,
        resolvedFocusedMoment$
      },
      'in-services/subscription/totalRawEventsCount': { default: () => getTotalEventsCount },
      'in-services/subscription/eventUpdates': { default: getEventUpdates },
      'in-services/subscription/events': { default: getEvents },
      'in-services/subscription/openEvents': { default: () => create() },
      'in-stores/serverTime': { serverTime$ },
      'in-services/stores/highlightedEntityId': {
        setHighlightedEntityId() {},
        clearHighlightedEntityId() {}
      }
    });
    mod.init();
  });

  describe('retrievedEvents$', () => {
    it('should work when there are no events', () => {
      mod.retrievedEvents$.subscribe(subscriber);
      const result = subscriber.getCall(0).args[0].issues;
      expect(result.length).to.equal(0);
    });

    it('should include historic data in aggregation', () => {
      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 10,
            end: 20,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

      mod.retrievedEvents$.subscribe(subscriber);

      const result = subscriber.getCall(1).args[0].issues;
      expect(result.length).to.equal(1);
      expect(result[0].time).to.equal(10);
      expect(result[0].get('id')).to.equal('foo');
    });

    it('should combine successive historic updates', () => {
      mod.retrievedEvents$.subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 10,
            end: 20,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'bar',
            start: 5,
            state: 'open',
            type: 'issue'
          }
        ])
      );

      const result = subscriber.getCall(1).args[0].issues;
      expect(result.length).to.equal(2);
      expect(result[0].time).to.equal(5);
      expect(result[0].get('id')).to.equal('bar');
      expect(result[1].time).to.equal(10);
      expect(result[1].get('id')).to.equal('foo');
    });

    it('should merge historic with live updates', () => {
      mod.retrievedEvents$.subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 10,
            end: 20,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'bar',
            start: 5,
            state: 'open',
            type: 'issue'
          }
        ])
      );

      const result = subscriber.getCall(1).args[0].issues;
      expect(result.length).to.equal(2);
      expect(result[0].time).to.equal(5);
      expect(result[0].get('id')).to.equal('bar');
      expect(result[1].time).to.equal(10);
      expect(result[1].get('id')).to.equal('foo');
    });

    it('should provide sorted events list', () => {
      mod.retrievedEvents$.subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 10,
            end: 20,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'bar',
            start: 5,
            state: 'open',
            type: 'issue'
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'pups',
            start: 15,
            end: 20,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

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

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 20,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'bar',
            start: 5,
            state: 'open',
            type: 'issue'
          }
        ])
      );

      const result = subscriber.getCall(2).args[0].issues;
      expect(result.length).to.equal(2);
      expect(result[0].get('id')).to.equal('bar');
      expect(result[1].get('id')).to.equal('foo');
    });

    it('should categorized events', () => {
      mod.retrievedEvents$.subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 20,
            state: 'closed',
            type: 'change'
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'pups',
            start: 19,
            end: 20,
            state: 'closed',
            type: 'incident'
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'bar',
            start: 15,
            state: 'open',
            type: 'issue'
          }
        ])
      );

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

      getEventsResult.emit(
        fromJS([
          {
            id: 'bar',
            start: 15,
            state: 'open',
            type: 'issue'
          }
        ])
      );

      let result = subscriber.getCall(1).args[0];
      expect(result.issues.length).to.equal(1);
      expect(result.issues[0].get('end')).to.equal(undefined);

      getEventsResult.emit(
        fromJS([
          {
            id: 'bar',
            start: 15,
            end: 20,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

      result = subscriber.getCall(2).args[0];
      expect(result.issues.length).to.equal(1);
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

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 20,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'pups',
            start: 19,
            end: 20,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

      const result = subscriber.getCall(2).args[0];
      expect(result.issues.length).to.equal(1);
      expect(result.issues[0].get('id')).to.equal('foo');
    });
  });

  describe('openEventsAtServerTime$', () => {
    it('should only keep open events for the server time', () => {
      serverTime$.emit(10);

      mod.openEventsAtServerTime$.subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 11,
            type: 'issue',
            state: 'open'
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'pups',
            start: 19,
            end: 10,
            type: 'issue',
            state: 'closed'
          }
        ])
      );

      getTotalEventsCount.emit(
        fromJS({
          incidentCount: 123
        })
      );

      expect(subscriber.callCount).to.equal(2);
      const result = subscriber.getCall(1).args[0];
      expect(result.get('incidentCount')).to.equal(123);
    });
  });

  describe('openEventsAtFocusedMoment$', () => {
    it('should only keep open events for the server time when focused moment is live', () => {
      serverTime$.emit(10);
      focusedMoment$.emit(null);

      mod.openEventsAtFocusedMoment$.subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 11,
            type: 'issue',
            state: 'open'
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'pups',
            start: 19,
            end: 10,
            type: 'issue',
            state: 'closed'
          }
        ])
      );

      expect(subscriber.callCount).to.equal(4);
      const result = subscriber.getCall(3).args[0];
      expect(result.issues.length).to.equal(1);
      expect(result.issues[0].get('id')).to.equal('foo');
    });

    it('should only keep open events for the focused moment', () => {
      serverTime$.emit(15);
      focusedMoment$.emit(10);

      mod.openEventsAtFocusedMoment$.subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 11,
            type: 'issue'
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'pups',
            start: 19,
            end: 10,
            type: 'issue'
          }
        ])
      );

      expect(subscriber.callCount).to.equal(4);
      const result = subscriber.getCall(3).args[0];
      expect(result.issues.length).to.equal(1);
      expect(result.issues[0].get('id')).to.equal('foo');
    });
  });

  describe('getOpenIssuesAtFocusedMoment', () => {
    const snapshotId = '1234567890abc';

    it('should only return issues for the selected snapshot', () => {
      focusedMoment$.emit(6);

      mod.getOpenIssuesAtFocusedMoment(snapshotId).subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 10,
            type: 'issue',
            problem: {
              snapshotId
            }
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo2',
            start: 0,
            end: 7,
            type: 'issue',
            problem: {
              snapshotId
            }
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'pups',
            start: 19,
            end: 10,
            type: 'issue',
            problem: {
              snapshotId: 'watAnderes'
            }
          }
        ])
      );

      expect(subscriber.callCount).to.equal(4);
      const result = subscriber.getCall(3).args[0];
      expect(result.size).to.equal(2);
      expect(result.getIn([0, 'id'])).to.equal('foo2');
      expect(result.getIn([1, 'id'])).to.equal('foo');
    });

    it('should only return issues for the selected snapshot at the focused moment', () => {
      focusedMoment$.emit(7);

      mod.getOpenIssuesAtFocusedMoment(snapshotId).subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 10,
            type: 'issue',
            problem: {
              snapshotId
            }
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo2',
            start: 0,
            end: 7,
            type: 'issue',
            problem: {
              snapshotId
            }
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'pups',
            start: 19,
            end: 10,
            type: 'issue',
            problem: {
              snapshotId: 'watAnderes'
            }
          }
        ])
      );

      expect(subscriber.callCount).to.equal(4);
      const result = subscriber.getCall(3).args[0];
      expect(result.size).to.equal(1);
      expect(result.getIn([0, 'id'])).to.equal('foo');
    });
  });

  describe('getMostImportantEventAtFocusedMoment', () => {
    const snapshotId = '1234567890abc';

    it('should only return issues for the selected snapshot', () => {
      focusedMoment$.emit(6);

      mod.getMostImportantEventAtFocusedMoment(snapshotId).subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 10,
            type: 'issue',
            severity: 6,
            problem: {
              snapshotId
            }
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo2',
            start: 0,
            end: 7,
            type: 'issue',
            problem: {
              snapshotId
            },
            severity: 3
          }
        ])
      );

      getEventsResult.emit(
        fromJS([
          {
            id: 'pups',
            start: 19,
            end: 10,
            type: 'issue',
            problem: {
              snapshotId: 'watAnderes'
            }
          }
        ])
      );

      expect(subscriber.callCount).to.equal(2);
      expect(subscriber.getCall(1).args[0].get('id')).to.equal('foo');

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 6,
            type: 'issue',
            snapshotId,
            severity: 6
          }
        ])
      );

      expect(subscriber.callCount).to.equal(3);
      expect(subscriber.getCall(2).args[0].get('id')).to.equal('foo2');
    });
  });

  describe('getNearestEvent$', () => {
    it('should return null if there are no events', () => {
      timeframe$.emit({
        to: 100,
        windowSize: 100
      });
      from$.emit(0);
      to$.emit(100);

      mod.eventsInTimeframe$.subscribe(subscriber);

      getEventsResult.emit(fromJS([]));

      const result = subscriber.getCall(1).args[0];
      expect(mod.getNearestEvent(result.issues, 40)).to.equal(null);
    });

    it('should find the only inserted item', () => {
      timeframe$.emit({
        to: 100,
        windowSize: 100
      });
      from$.emit(0);
      to$.emit(100);

      mod.eventsInTimeframe$.subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 20,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

      const result = subscriber.getCall(2).args[0];

      expect(mod.getNearestEvent(result.issues, 90).get('id')).to.equal('foo');
    });

    it('should find the nearest event', () => {
      timeframe$.emit({
        to: 100,
        windowSize: 100
      });
      from$.emit(0);
      to$.emit(100);

      mod.eventsInTimeframe$.subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 20,
            state: 'closed',
            type: 'issue'
          },
          {
            id: 'bar',
            start: 19,
            end: 20,
            state: 'closed',
            type: 'issue'
          },
          {
            id: 'pups',
            start: 40,
            end: 50,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

      const result = subscriber.getCall(2).args[0];

      expect(mod.getNearestEvent(result.issues, 0).get('id')).to.equal('foo');
      expect(mod.getNearestEvent(result.issues, 10).get('id')).to.equal('foo');
      expect(mod.getNearestEvent(result.issues, 20).get('id')).to.equal('bar');
      expect(mod.getNearestEvent(result.issues, 30).get('id')).to.equal('pups');
      expect(mod.getNearestEvent(result.issues, 90).get('id')).to.equal('pups');
    });

    it('should allow maxDistance thresholds', () => {
      timeframe$.emit({
        to: 100,
        windowSize: 100
      });
      from$.emit(0);
      to$.emit(100);

      mod.eventsInTimeframe$.subscribe(subscriber);

      getEventsResult.emit(
        fromJS([
          {
            id: 'foo',
            start: 5,
            end: 20,
            state: 'closed',
            type: 'issue'
          },
          {
            id: 'bar',
            start: 19,
            end: 20,
            state: 'closed',
            type: 'issue'
          }
        ])
      );

      const issues = subscriber.getCall(2).args[0].issues;

      expect(mod.getNearestEvent(issues, 10, 5).get('id')).to.equal('foo');
      expect(mod.getNearestEvent(issues, 10, 4)).to.equal(null);
      expect(mod.getNearestEvent(issues, 12).get('id')).to.equal('foo');
      expect(mod.getNearestEvent(issues, 29, 5)).to.equal(null);
      expect(mod.getNearestEvent(issues, 1, 2)).to.equal(null);
    });
  });

  describe('getColorForEventAtFocusedMomentAsStream', () => {
    it('should color issues according to server time when no focused moment is defined', () => {
      const issue = fromJS({
        id: 'foo',
        start: 5,
        end: 20,
        state: 'closed',
        type: 'issue',
        problem: {
          severity: 9
        }
      });
      focusedMoment$.emit(null);

      mod.getColorForEventAtFocusedMomentAsStream(issue).subscribe(subscriber);

      expect(subscriber.getCall(0).args[0]).to.equal(getColorBySeverity(0));
    });

    it('should color issues according to server time when no focused moment is defined', () => {
      const issue = fromJS({
        id: 'foo',
        start: 5,
        end: 20,
        state: 'open',
        type: 'issue',
        problem: {
          severity: 9
        }
      });
      focusedMoment$.emit(null);

      mod.getColorForEventAtFocusedMomentAsStream(issue).subscribe(subscriber);

      expect(subscriber.getCall(0).args[0]).to.equal(getColorBySeverity(9));
    });

    it('should color issues according to focused moment when one is selected', () => {
      const issue = fromJS({
        id: 'foo',
        start: 5,
        end: 20,
        state: 'closed',
        type: 'issue',
        problem: {
          severity: 9
        }
      });
      focusedMoment$.emit(20);

      mod.getColorForEventAtFocusedMomentAsStream(issue).subscribe(subscriber);

      expect(subscriber.getCall(0).args[0]).to.equal(getColorBySeverity(0));
    });

    it('should color issues according to focused moment when one is selected', () => {
      const issue = fromJS({
        id: 'foo',
        start: 5,
        end: 20,
        state: 'closed',
        type: 'issue',
        problem: {
          severity: 9
        }
      });
      focusedMoment$.emit(19);

      mod.getColorForEventAtFocusedMomentAsStream(issue).subscribe(subscriber);

      expect(subscriber.getCall(0).args[0]).to.equal(getColorBySeverity(9));
    });

    it('should color changes using the default color', () => {
      const issue = fromJS({
        id: 'foo',
        start: 5,
        end: 20,
        state: 'open',
        type: 'change'
      });
      focusedMoment$.emit(null);

      mod.getColorForEventAtFocusedMomentAsStream(issue).subscribe(subscriber);

      expect(subscriber.getCall(0).args[0]).to.equal(getColorBySeverity(0));
    });

    it(
      'should color issues according to focused moment time when focused moment is defined' +
        'and issue was open so it has no end defined',
      () => {
        const issue = fromJS({
          id: 'foo',
          start: 5,
          state: 'open',
          type: 'issue',
          problem: {
            severity: 9
          }
        });
        focusedMoment$.emit(null);

        mod.getColorForEventAtFocusedMomentAsStream(issue).subscribe(subscriber);

        expect(subscriber.getCall(0).args[0]).to.equal(getColorBySeverity(9));
      }
    );
  });

  describe('healthColor', () => {
    it('should calculate the same colors for normalized and "old" severities', () => {
      expect(mod.getColorBySeverity(0)).to.equal(getColorBySeverity(0));
      expect(mod.getColorBySeverity(2)).to.equal(getColorBySeverity(0.2));
      expect(mod.getColorBySeverity(3)).to.equal(getColorBySeverity(0.3));
      expect(mod.getColorBySeverity(4)).to.equal(getColorBySeverity(0.4));
      expect(mod.getColorBySeverity(5)).to.equal(getColorBySeverity(0.5));
      expect(mod.getColorBySeverity(6)).to.equal(getColorBySeverity(0.6));
      expect(mod.getColorBySeverity(7)).to.equal(getColorBySeverity(0.7));
      expect(mod.getColorBySeverity(8)).to.equal(getColorBySeverity(0.8));
      expect(mod.getColorBySeverity(9)).to.equal(getColorBySeverity(0.9));
      expect(mod.getColorBySeverity(10)).to.equal(getColorBySeverity(1));
    });
  });
});
