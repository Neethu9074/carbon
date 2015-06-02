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

    const create = sinon.stub();
    create.returns(observable);

    issueTracker = proxyquire('./index', {
      '../conveyer': {create}
    });

    issuesStubData = Immutable.fromJS([{
     'id': 'i1',
     'problems': [{
       'pluginId': 'o1',
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

});
