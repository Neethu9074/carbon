/* eslint-env mocha */

import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {formatTime, formatDate} from 'in-services/formatters/date';
import {resetStoreRegistry} from 'in-stores/store';

// 2016-06-13 07:09:25.102Z
const initialServerTime = 1465801765102;

// import {serverTime$} from 'in-stores/serverTime';

describe.skip('in-components/timeline/components/DatePicker/datePickerStore', () => {

  let bigBangTimestamp$;
  let serverTime$;
  let mod;

  beforeEach(() => {
    resetStoreRegistry();

    bigBangTimestamp$ = create().emit(initialServerTime - 1000 * 60 * 60 * 24 * 7 * 2);
    serverTime$ = create().emit(initialServerTime);

    mod = proxyquire('./datePickerStore', {
      'in-stores/timeline': {bigBangTimestamp$},
      'in-stores/serverTime': {serverTime$}
    });
  });

  describe('validation', () => {
    let dateValidSubscriber;
    let timeValidSubscriber;

    beforeEach(() => {
      dateValidSubscriber = sinon.stub();
      timeValidSubscriber = sinon.stub();

      mod.setDateString(formatDate(initialServerTime));
      mod.setTimeString(formatTime(initialServerTime));
    });

    it('should be valid initially', () => {
      subscribe();
      expect(dateValidSubscriber).to.have.been.calledWith(true);
      expect(timeValidSubscriber).to.have.been.calledWith(true);
    });

    it('should be invalid when date is in the future', () => {
      mod.setDateString('2016-06-14');
      subscribe();
      expect(dateValidSubscriber).to.have.been.calledWith(false);
      expect(timeValidSubscriber).to.have.been.calledWith(false);
    });

    it('should be invalid when time is in the future', () => {
      mod.setTimeString('11:30:00');
      subscribe();
      expect(dateValidSubscriber).to.have.been.calledWith(false);
      expect(timeValidSubscriber).to.have.been.calledWith(false);
    });

    it('should be valid when time is in the future, but date is in the past', () => {
      mod.setDateString('2016-06-12');
      mod.setTimeString('11:30:00');
      subscribe();
      expect(dateValidSubscriber).to.have.been.calledWith(true);
      expect(timeValidSubscriber).to.have.been.calledWith(true);
    });

    it('should be invalid when the date format is wrong', () => {
      mod.setDateString('2016-012');
      mod.setTimeString('11:30:00');
      subscribe();
      expect(dateValidSubscriber).to.have.been.calledWith(false);
      expect(timeValidSubscriber).to.have.been.calledWith(true);
    });

    it('should be invalid when the time format is wrong', () => {
      mod.setDateString('2016-06-12');
      mod.setTimeString('80:00');
      subscribe();
      expect(dateValidSubscriber).to.have.been.calledWith(true);
      expect(timeValidSubscriber).to.have.been.calledWith(false);
    });

    function subscribe() {
      mod.dateIsValid$.subscribe(dateValidSubscriber);
      mod.timeIsValid$.subscribe(timeValidSubscriber);
    }
  });
});
