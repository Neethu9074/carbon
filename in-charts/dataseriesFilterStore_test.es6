/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';

import createDataSeriesFilterStore from './dataseriesFilterStore';

describe('in-charts/dataseriesFilterStore', () => {
  let store;
  let subscriber;

  beforeEach(() => {
    store = createDataSeriesFilterStore();
    subscriber = sinon.stub();
    store.activeFilters$.subscribe(subscriber);
  });

  it('should not have any filters in the beginning', () => {
    expect(subscriber.getCall(0).args[0]).to.deep.equal({});
  });

  it('should add filters', () => {
    store.toggleFilter('foobar');
    expect(subscriber.getCall(1).args[0]).to.deep.equal({ foobar: true });
  });

  it('should toggle filters', () => {
    store.toggleFilter('foobar');
    expect(subscriber.getCall(1).args[0]).to.deep.equal({ foobar: true });

    store.toggleFilter('foobar');
    expect(subscriber.getCall(2).args[0]).to.deep.equal({});
  });

  it('should add multiple filters', () => {
    store.toggleFilter('foobar');
    expect(subscriber.getCall(1).args[0]).to.deep.equal({ foobar: true });

    store.toggleFilter('blub');
    expect(subscriber.getCall(2).args[0]).to.deep.equal({ foobar: true, blub: true });
  });
});
