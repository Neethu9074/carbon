/*eslint-env mocha*/
/*eslint-disable max-len*/

'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import * as ro from 'reactive-observables';
import Immutable from 'immutable';

describe('issueTracker', () => {

  let issuesStubData;
  let observable;
  let issueTracker;

  beforeEach(() => {
    observable = ro.create();
    /*eslint-disable camelcase, no-underscore-dangle, no-undef*/
    global.__DEV__ = false;
    global.window = global.window || {};
    global.window.instana = {
      config: {
        environment: 'production'
      }
    };
    /*eslint-enable camelcase, no-underscore-dangle, no-undef*/

    const create = sinon.stub();
    create.returns(observable);

    issueTracker = proxyquire('./index', {
      '../conveyer': {create}
    });

    issuesStubData = Immutable.fromJS([{
     'id': 'i1',
     'problems': [{
       'pluginId': 'p1',
       'steadyId': 's1',
       'hostId': 'h1',
       'problemText': 'You will run out of main memory just within next 2 hours',
       'fixSuggestion': 'Analyse running processes for eventual memory...',
       'explanation': 'Determined through linear regression',
       'severity': 5
     }],
     'start': 1433251409977,
     'end': null
   }]);
  });

  describe('getIssues', () => {

    it('should publish all issues', (done) => {
      issueTracker.getIssues()
        .subscribe(issues => {
          expect(issues.size).to.equal(1);
          expect(issues.getIn([0, 'id']))
            .to.equal(issuesStubData.getIn([0, 'id']));
          done();
        });

      observable.emit(issuesStubData);
    });

    it('should aggregate successive issue messages', (done) => {
      let callCount = 0;
      issueTracker.getIssues()
        .subscribe(issues => {
          callCount++;
          if (callCount === 2) {
            expect(issues.size).to.equal(2);
            expect(issues.getIn([0, 'id'])).to.equal('i1');
            expect(issues.getIn([1, 'id'])).to.equal('i2');
            done();
          }
        });

      observable.emit(issuesStubData);
      observable.emit(issuesStubData.setIn([0, 'id'], 'i2'));
    });

    it('should update existing issues', (done) => {
      let callCount = 0;
      issueTracker.getIssues()
        .subscribe(issues => {
          callCount++;
          if (callCount === 2) {
            expect(issues.size).to.equal(1);
            expect(issues.getIn([0, 'end'])).to.equal(42);
            done();
          }
        });

      observable.emit(issuesStubData);
      observable.emit(issuesStubData.setIn([0, 'end'], 42));
    });
  });

  describe('getOpenIssues', () => {
    it('should not include issues with an end date', (done) => {
      let callCount = 0;
      issueTracker.getOpenIssues()
        .subscribe(issues => {
          callCount++;
          if (callCount === 1) {
            expect(issues.size).to.equal(0);
          } else {
            expect(issues.size).to.equal(1);
            expect(issues.getIn([0, 'id'])).to.equal('i2');
            done();
          }
        });

      observable.emit(issuesStubData.setIn([0, 'end'], 42));
      observable.emit(issuesStubData.setIn([0, 'id'], 'i2'));
    });

  });

  describe('getIssueSummary', () => {
    it('should summarize severities across issues', () => {
      const stub = sinon.stub();
      issueTracker.getIssueSummary().subscribe(stub);
      expect(stub.callCount).to.equal(0);

      observable.emit(issuesStubData);
      expect(stub.callCount).to.equal(1);
      let summary = stub.getCall(0).args[0];
      expect(summary.get('warning').size).to.equal(1);
      expect(summary.get('danger').size).to.equal(0);

      observable.emit(issuesStubData.setIn([0, 'id'], 'i2')
        .setIn([0, 'problems', 0, 'severity'], 10));
      expect(stub.callCount).to.equal(2);
      summary = stub.getCall(1).args[0];
      expect(summary.get('warning').size).to.equal(1);
      expect(summary.get('danger').size).to.equal(1);
    });

    it('should read multiple problems per issue', () => {
      const stub = sinon.stub();
      issueTracker.getIssueSummary().subscribe(stub);

      const data = issuesStubData.setIn([0, 'problems', 1], Immutable.fromJS({
        'pluginId': 'o1',
        'steadyId': 's1',
        'hostId': 'h1',
        'problemText': 'You will run out of main memory just within',
        'fixSuggestion': 'Analyse running processes for eventual',
        'explanation': 'Determined through linear regression',
        'severity': 10
      }));

      observable.emit(data);
      expect(stub.callCount).to.equal(1);
      let summary = stub.getCall(0).args[0];
      expect(summary.get('warning').size).to.equal(1);
      expect(summary.get('danger').size).to.equal(1);
    });

    it('should provide IDs for endangered snapshots', () => {
      const stub = sinon.stub();
      issueTracker.getIssueSummary().subscribe(stub);

      observable.emit(issuesStubData);

      let summary = stub.getCall(0).args[0];
      expect(summary.get('warning').size).to.equal(1);
      const snapshotId = summary.get('warning').keys().next().value;
      expect(snapshotId.get('pluginId')).to.equal('p1');
      expect(snapshotId.get('hostId')).to.equal('h1');
      expect(snapshotId.get('steadyId')).to.equal('s1');
      expect(summary.getIn(['warning', snapshotId])).to.equal(1);
    });
  });

  describe('getIssueCountSummary', () => {
    it('should summarize severities across issues', () => {
      const stub = sinon.stub();
      issueTracker.getIssueCountSummary().subscribe(stub);
      expect(stub.callCount).to.equal(0);

      observable.emit(issuesStubData);
      expect(stub.callCount).to.equal(1);
      let summary = stub.getCall(0).args[0];
      expect(summary.get('warning')).to.equal(1);
      expect(summary.get('danger')).to.equal(0);

      observable.emit(issuesStubData.setIn([0, 'id'], 'i2')
        .setIn([0, 'problems', 0, 'severity'], 10));
      expect(stub.callCount).to.equal(2);
      summary = stub.getCall(1).args[0];
      expect(summary.get('warning')).to.equal(1);
      expect(summary.get('danger')).to.equal(1);
    });

    it('should read multiple problems per issue', () => {
      const stub = sinon.stub();
      issueTracker.getIssueCountSummary().subscribe(stub);

      const data = issuesStubData.setIn([0, 'problems', 1], Immutable.fromJS({
        'pluginId': 'o1',
        'steadyId': 's1',
        'hostId': 'h1',
        'problemText': 'You will run out of main memory just within',
        'fixSuggestion': 'Analyse running processes for eventual',
        'explanation': 'Determined through linear regression',
        'severity': 10
      }));

      observable.emit(data);
      expect(stub.callCount).to.equal(1);
      let summary = stub.getCall(0).args[0];
      expect(summary.get('warning')).to.equal(1);
      expect(summary.get('danger')).to.equal(1);
    });
  });
});
