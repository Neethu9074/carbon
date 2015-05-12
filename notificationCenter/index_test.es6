/*eslint-env mocha*/

'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import rx from 'rx';
import Immutable from 'immutable';

describe('notificationConveyer', () => {

  let observable;
  let notificationCenter;

  beforeEach(() => {
    observable = new rx.Subject();

    const create = sinon.stub();
    create.returns(observable);

    notificationCenter = proxyquire('./index', {
      '../conveyer': {create}
    });
  });

  describe('getActiveProblems', () => {
    it('should emit notifications', (done) => {
      const notification = getNotification(1, 'problem');

      notificationCenter.getActiveProblems()
        .subscribe(notifications => {
          expect(notifications.size).to.equal(1);
          expect(notifications.get(0)).to.equal(notification);
          done();
        });

      observable.onNext(notification);
    });

    it('should bundle multiple successive notifications', (done) => {
      const n1 = getNotification(1, 'problem');
      const n2 = getNotification(2, 'problem');

      notificationCenter.getActiveProblems()
        .subscribe(notifications => {
          expect(notifications.size).to.equal(2);
          done();
        });

      observable.onNext(n1);
      observable.onNext(n2);
    });

    it('should sort notifications by timestamp', (done) => {
      const n1 = getNotification(1, 'problem').set('timestamp', 1);
      const n2 = getNotification(2, 'problem').set('timestamp', 0);

      notificationCenter.getActiveProblems()
        .subscribe(notifications => {
          expect(notifications.get(0)).to.equal(n2);
          expect(notifications.get(1)).to.equal(n1);
          done();
        });

      observable.onNext(n1);
      observable.onNext(n2);
    });

    it('should support notification updates', (done) => {
      const notification = getNotification(1, 'problem');

      let callCount = 0;
      notificationCenter.getActiveProblems()
        .subscribe(notifications => {
          if (callCount === 0) {
            expect(notifications.get(0)).to.equal(notification);
            callCount++;
          } else {
            expect(notifications.getIn([0, 'id']))
              .to
              .equal(notification.get('id'));
            expect(notifications.getIn([0, 'data', 'pluginId']))
              .to
              .equal('osPlugin');
            done();
          }
        });

      observable.onNext(notification);

      setTimeout(() => {
        observable.onNext(notification.setIn(['data', 'pluginId'], 'osPlugin'));
      }, 20);
    });
  });

  function getNotification(id, type) {
    return Immutable.fromJS({
      id,
      type,
      timestamp: new Date().getTime(),
      pluginId: 'p1',
      steadyId: 's1',
      hostId: 'h1',
      data: {
        title: 'Unusually high CPU usage',
        message: 'The host is normally doing more IO...',
        severity: 'danger'
      }
    });
  }
});
