/* eslint-env mocha */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {formatTime, formatDate} from 'in-services/formatters/date';
import {resetStoreRegistry} from 'in-stores/store';

// 2016-06-13 09:09:25
const initialServerTime = 1465801765102;
const twoWeeks = 1000 * 60 * 60 * 24 * 7 * 2;

describe('in-components/timeline/components/DatePicker/datePickerStore', () => {

  let dateValidSubscriber;
  let timeValidSubscriber;

  let timeSubscription;
  let dateSubscription;
  let bigBangTimestamp$;
  let serverTime$;
  let mod;

  beforeEach(() => {
    resetStoreRegistry();

    bigBangTimestamp$ = create().startWith(initialServerTime - twoWeeks).freeze();
    serverTime$ = create().startWith(initialServerTime).freeze();

    mod = proxyquire('./datePickerStore', {
      'in-stores/timeline': {bigBangTimestamp$},
      'in-stores/serverTime': {serverTime$}
    });
  });

  beforeEach(() => {
    dateValidSubscriber = sinon.stub();
    timeValidSubscriber = sinon.stub();

    mod.setDateString(formatDate(initialServerTime));
    mod.setTimeString(formatTime(initialServerTime));
  });

  afterEach(() => {
    timeSubscription.dispose();
    dateSubscription.dispose();
  });

  describe('validation', () => {

    it('should be valid initially', () => {
      subscribe();
      expect(dateValidSubscriber).to.have.callCount(1);
      expect(timeValidSubscriber).to.have.callCount(1);
      expect(dateValidSubscriber.getCall(0).args[0]).to.equal(true);
      expect(timeValidSubscriber.getCall(0).args[0]).to.equal(true);
    });

    it('should be invalid when date is in the future', () => {
      mod.setDateString('2016-06-14');
      subscribe();
      expect(dateValidSubscriber.getCall(0).args[0]).to.equal(false);
      expect(timeValidSubscriber.getCall(0).args[0]).to.equal(false);
    });

    it('should be invalid when time is in the future', () => {
      mod.setTimeString('11:30:00');
      subscribe();
      expect(dateValidSubscriber.getCall(0).args[0]).to.equal(true);
      expect(timeValidSubscriber.getCall(0).args[0]).to.equal(false);
    });

    it('should be valid when time is in the future, but date is in the past', () => {
      mod.setDateString('2016-06-12');
      mod.setTimeString('11:30:00');
      subscribe();
      expect(dateValidSubscriber.getCall(0).args[0]).to.equal(true);
      expect(timeValidSubscriber.getCall(0).args[0]).to.equal(true);
    });

    it('should be invalid when the date format is wrong', () => {
      mod.setDateString('2016-012');
      mod.setTimeString('11:30:00');
      subscribe();
      expect(dateValidSubscriber.getCall(0).args[0]).to.equal(false);
      expect(timeValidSubscriber.getCall(0).args[0]).to.equal(false);
    });

    it('should be invalid when the time format is wrong', () => {
      mod.setDateString('2016-06-12');
      mod.setTimeString('80:00');
      subscribe();
      expect(dateValidSubscriber.getCall(0).args[0]).to.equal(true);
      expect(timeValidSubscriber.getCall(0).args[0]).to.equal(false);
    });

    function subscribe() {
      timeSubscription = mod.isDateTimeValid$.map(dateTime => dateTime.date).subscribe(dateValidSubscriber);
      dateSubscription = mod.isDateTimeValid$.map(dateTime => dateTime.time).subscribe(timeValidSubscriber);
    }
  });
});
