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
  let getEvent$;
  let timeframe$;
  let getEvents;
  let serverTime$;
  let focusedMoment$;
  let resolvedFocusedMoment$;
  let getEventsResult;
  let getEventUpdates;
  let getEventUpdatesResult;
  let healthInfo$;
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
    healthInfo$ = create();
    getEvent$ = create();
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
      'in-services/issueTracker': { getEvent: () => getEvent$ },
      'in-services/subscription/openEvents': { default: () => create() },
      'in-services/subscription/healthInfo': { default: () => healthInfo$ },
      'in-stores/serverTime': { serverTime$ },
      'in-services/stores/highlightedEntityId': {
        setHighlightedEntityId() {},
        clearHighlightedEntityId() {}
      }
    });
    mod.init();
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

  describe('getMostImportantEventAtFocusedMoment', () => {
    const snapshotId = '1234567890abc';

    it('should only return issues for the selected snapshot', () => {
      focusedMoment$.emit(6);
      healthInfo$.emit(fromJS({ eventWithMaxSeverity: 'foo' }));

      mod.getMostImportantEventAtFocusedMoment(snapshotId).subscribe(subscriber);

      getEvent$.emit(
        fromJS({
          id: 'foo',
          start: 5,
          end: 10,
          type: 'issue',
          severity: 6,
          problem: {
            snapshotId
          }
        })
      );

      getEvent$.emit(
        fromJS({
          id: 'foo2',
          start: 0,
          end: 7,
          type: 'issue',
          problem: {
            snapshotId
          },
          severity: 3
        })
      );

      expect(subscriber.callCount).to.equal(2);
      expect(subscriber.getCall(1).args[0].get('id')).to.equal('foo2');

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

      expect(subscriber.callCount).to.equal(2);
      expect(subscriber.getCall(1).args[0].get('id')).to.equal('foo2');
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
