/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

describe('in-infrastructure/tableView/components/Table/stores/content', () => {
  let createStore;
  let getMetric;
  let store;
  let dataSubscriber;

  beforeEach(() => {
    getMetric = sinon.stub();
    createStore = proxyquire('in-infrastructure/tableView/components/Table/stores/content', {
      'in-stores/metric': {
        getMetric
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
      expect(data.get('127.0.0.1')).to.be.an('object');
      expect(data.get('192.168.0.1')).to.be.an('object');

      const rowA = data.get('127.0.0.1');
      expect(rowA.mutationCount).to.equal(0);
      expect(rowA.key).to.equal('127.0.0.1');
      expect(rowA.columns).to.be.an('array');
      expect(rowA.columns[0].columnDefinition).to.equal(columnDefinition);
      expect(rowA.columns[0].value).to.equal('42');
      expect(getValue).to.have.callCount(2);
    });
  });
});
