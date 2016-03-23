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
      'id': 'i1',
      'problem': {
        'id': 'p1',
        'snapshotId': 'snappiId',
        'problemText': 'You will run out of main memory just within next 2 hours',
        'fixSuggestion': 'Analyse running processes for eventual memory…',
        'explanation': 'Determined through linear regression',
        'severity': 5
      },
      'start': 1433251409977
      // no end == state : OPEN
    }]);

     historicalIssuesStubData = Immutable.fromJS([{
      'id': 'i1',
      'problem': {
        'id': 'p1',
        'snapshotId': 'snappiId',
        'problemText': 'You will run out of main memory just within next 2 hours',
        'fixSuggestion': 'Analyse running processes for eventual memory…',
        'explanation': 'Determined through linear regression',
        'severity': 5
      },
      'start': 1433251400000,
      'end': 1433251500000
    }]);
  });

  describe('getOpenIssues', () => {

    it('should send initial data', () => {
      let openIssues;
      issueTracker.getOpenIssuesStream().subscribe(issues => openIssues = issues.toJS());
      openIssuesObservable.emit(openIssuesStubData);

      expect(openIssues.length).to.equal(1);
    });

  });

  describe('getHistoricalIssues', () => {

    it('should send initial data', () => {
      let historicalIssues;
      issueTracker.getHistoricalIssuesStream().subscribe(issues => historicalIssues = issues.toJS());
      historicalIssuesObservable.emit(historicalIssuesStubData);

      expect(historicalIssues.length).to.equal(1);
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
});
