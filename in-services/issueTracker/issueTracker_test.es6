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

  let historicalIssuesObservable;
  let historicalIssuesStubData;
  let openIssuesObservable;
  let openIssuesStubData;
  let issueTracker;

  beforeEach(() => {
    resetStoreRegistry();

    historicalIssuesObservable = ro.create();
    openIssuesObservable = ro.create();

    /* eslint-disable camelcase, no-underscore-dangle, no-undef */
    global.__DEV__ = false;
    global.window = global.window || {};
    global.window.instana = {
      config: {
        environment: 'production'
      }
    };
    /* eslint-enable camelcase, no-underscore-dangle, no-undef */

    const historicalIssuesStreamstub = sinon.stub();
    historicalIssuesStreamstub.returns(historicalIssuesObservable);

    const openIssuesStreamstub = sinon.stub();
    openIssuesStreamstub.returns(openIssuesObservable);

    issueTracker = proxyquire('./issueTracker', {
      'in-stores/historicalIssues': { getHistoricalIssues: historicalIssuesStreamstub },
      'in-stores/openIssues': { getOpenIssues: openIssuesStreamstub }
    });

    openIssuesStubData = Immutable.fromJS([{
        'id': 'oi1',
        'start': 1433251409977
      }, {
        'id': 'oi2',
        'start': 1433251409977
      }
    ]);

    historicalIssuesStubData = Immutable.fromJS([{
        'id': 'hi1',
        'start': 1433251400000,
        'end': 1433251500000
      }
    ]);
  });

  describe('getOpenIssues', () => {

    it('should send initial data', () => {
      let openIssues;
      issueTracker.getOpenIssuesStream().subscribe(issues => openIssues = issues.toJS());
      openIssuesObservable.emit(openIssuesStubData);

      expect(openIssues.length).to.equal(2);
      expect(openIssues[0].id).to.equal('oi1');
      expect(openIssues[1].id).to.equal('oi2');
    });

  });

  describe('getHistoricalIssues', () => {

    it('should send initial data', () => {
      let historicalIssues;
      issueTracker.getHistoricalIssuesStream().subscribe(issues => historicalIssues = issues.toJS());
      historicalIssuesObservable.emit(historicalIssuesStubData);

      expect(historicalIssues.length).to.equal(1);
      expect(historicalIssues[0].id).to.equal('hi1');
    });

  });

  describe('getCombinedIssues', () => {

    it('should combine both, historical and open issues', () => {
      let combinedIssues;
      issueTracker.getCombinedIssuesStream().subscribe(issues => combinedIssues = issues.toJS());
      historicalIssuesObservable.emit(historicalIssuesStubData);
      openIssuesObservable.emit(openIssuesStubData);

      expect(combinedIssues.length).to.equal(3);
      expect(combinedIssues[0].id).to.equal('hi1');
      expect(combinedIssues[1].id).to.equal('oi1');
      expect(combinedIssues[2].id).to.equal('oi2');
    });

  });

  describe('getColorForIssue', () => {

    it('should throw an error if there is no given issue', () => {
      expect(() => issueTracker.getColorForIssue(undefined)).to.throw(Error);
    });

    it('should return ok color on closed issues', () => {
      let issue = Immutable.fromJS({
        problem: {
          severity: 0
        }
      });
      expect(issueTracker.getColorForIssue(issue)).to.equal(theme.health[0]);

      issue = issue.setIn(['problem', 'severity'], 5);
      expect(issueTracker.getColorForIssue(issue)).to.equal(theme.health[5]);

      issue = issue.setIn(['problem', 'severity'], 10);
      expect(issueTracker.getColorForIssue(issue)).to.equal(theme.health[10]);
    });

    it('should return default color for closed issues', () => {
      let issue = Immutable.fromJS({
        problem: {
          severity: 0
        },
        end: 42
      });
      expect(issueTracker.getColorForIssue(issue)).to.equal(theme.health[0]);

      issue = issue.setIn(['problem', 'severity'], 5);
      expect(issueTracker.getColorForIssue(issue)).to.equal(theme.health[0]);

      issue = issue.setIn(['problem', 'severity'], 10);
      expect(issueTracker.getColorForIssue(issue)).to.equal(theme.health[0]);
    });

  });

  describe('getMostImportantIssue', () => {

    it('should return the most important issue if there are multiple issues for the same entity', () => {
      let mostImportantIssue;
      issueTracker.getMostImportantIssue('123').subscribe(issue => mostImportantIssue = issue);

      openIssuesObservable.emit(Immutable.fromJS([{
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

      expect(mostImportantIssue.get('id')).to.equal('oi2');
    });

    it('should return the only issue if there is only one', () => {
      let mostImportantIssue;
      issueTracker.getMostImportantIssue('123').subscribe(issue => mostImportantIssue = issue);

      openIssuesObservable.emit(Immutable.fromJS([{
          'id': 'oi1',
          'problem': {
            'snapshotId': '123',
            'severity': 0
          },
          'start': 1433251409977
        }
      ]));

      expect(mostImportantIssue.get('id')).to.equal('oi1');
    });

    it('should return nothing if there are no issues', () => {
      let mostImportantIssue;
      issueTracker.getMostImportantIssue('123').subscribe(issue => mostImportantIssue = issue);

      openIssuesObservable.emit(Immutable.fromJS([]));

      expect(mostImportantIssue).to.equal(undefined);
    });

  });

});
