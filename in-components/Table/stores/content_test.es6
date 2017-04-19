/* eslint-env mocha */

import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { number } from 'in-services/formatters/number';

describe('in-components/Table/stores/content', () => {
  let createStore;
  let getMetricForFocusedMoment;
  let store;
  let dataSubscriber;

  beforeEach(() => {
    getMetricForFocusedMoment = sinon.stub();
    createStore = proxyquire('in-components/Table/stores/content', {
      'in-stores/metric': {
        getMetricForFocusedMoment
      }
    }).createStore;
    store = null;
    dataSubscriber = sinon.stub();
  });

  describe('string columns', () => {
    it('must support simple string columns', () => {
      const getValue = sinon.stub();
      getValue.returns('42');
      const getContent = sinon.stub();
      getContent.returns('42%');
      const columnDefinition = {
        title: 'Host',
        type: 'string',
        typeArgs: {
          getValue,
          getContent
        }
      };

      store = createStore({
        columnDefinitions: [columnDefinition]
      });
      store.onRowChange([{ key: '127.0.0.1' }, { key: '192.168.0.1' }]);
      store.data$.subscribe(dataSubscriber);

      expect(dataSubscriber).to.have.callCount(1);
      const data = dataSubscriber.getCall(0).args[0];
      expect(data['127.0.0.1']).to.be.an('object');
      expect(data['192.168.0.1']).to.be.an('object');

      const rowA = data['127.0.0.1'];
      expect(rowA.mutationCount).to.equal(0);
      expect(rowA.key).to.equal('127.0.0.1');
      expect(rowA.columns).to.be.an('array');
      expect(rowA.columns[0].columnDefinition).to.equal(columnDefinition);
      expect(rowA.columns[0].value).to.equal('42');
      expect(getValue).to.have.callCount(2);
    });
  });

  describe('metric columns', () => {
    it('must support simple metric columns', () => {
      const snapshotId = 'abcId';
      const key = 'abcKey';
      const rowConfig = { key, snapshotId };
      const getSnapshotId = sinon.stub();
      getSnapshotId.withArgs(rowConfig).returns(snapshotId);
      const metric$ = create();
      getMetricForFocusedMoment.onCall(0).returns(metric$);

      const columnDefinition = {
        title: 'CPU load',
        type: 'metric',
        typeArgs: {
          getSnapshotId,
          getMetricName: () => 'cpu.load',
          timeWindowAggregation: 'mean',
          getContent: number.compact
        }
      };

      store = createStore({
        columnDefinitions: [columnDefinition]
      });

      // first data emit – no metric value
      store.onRowChange([rowConfig]);
      store.data$.subscribe(dataSubscriber);

      // next data emit - with metric value
      const metricValue = 47;
      metric$.emit([Date.now(), metricValue]);

      expect(dataSubscriber).to.have.callCount(2);
      const row = dataSubscriber.getCall(1).args[0][key];
      expect(row.mutationCount).to.equal(1);
      expect(row.columns[0].value).to.equal(metricValue);
    });

    it('must unsubscribe metric subscriptions when rows are removed', () => {
      const snapshotId = 'abcId';
      const key = 'abcKey';
      const rowConfig = { key, snapshotId };
      const getSnapshotId = sinon.stub();
      getSnapshotId.withArgs(rowConfig).returns(snapshotId);
      let subscriptionActive = false;
      const metric$ = create({
        start() {
          subscriptionActive = true;
        },

        stop() {
          subscriptionActive = false;
        }
      });
      getMetricForFocusedMoment.onCall(0).returns(metric$);

      const columnDefinition = {
        title: 'CPU load',
        type: 'metric',
        typeArgs: {
          getSnapshotId,
          getMetricName: () => 'cpu.load',
          timeWindowAggregation: 'mean',
          getContent: number.compact
        }
      };

      store = createStore({
        columnDefinitions: [columnDefinition]
      });

      store.data$.subscribe(dataSubscriber);
      expect(dataSubscriber).to.have.callCount(1);
      expect(Object.keys(dataSubscriber.getCall(0).args[0]).length).to.equal(0);
      expect(subscriptionActive).to.equal(false);

      store.onRowChange([rowConfig]);
      expect(dataSubscriber).to.have.callCount(2);
      expect(Object.keys(dataSubscriber.getCall(1).args[0]).length).to.equal(1);
      expect(subscriptionActive).to.equal(true);

      store.onRowChange([]);
      expect(dataSubscriber).to.have.callCount(3);
      expect(Object.keys(dataSubscriber.getCall(2).args[0]).length).to.equal(0);
      expect(subscriptionActive).to.equal(false);
    });
  });
});
