/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {createStore} from 'in-stores/store';


const backendDataMock = createStore({
  name: 'trace data mock'
});

let sortingProperty;
let sortDirection;
let filterString;
const mod = proxyquire('in-stores/traceData', {
  // mock createTraceDataObservable
  'in-services/subscription/traceData': (event) => {
    sortingProperty = event.sortingProperty;
    sortDirection = event.sortDirection;
    filterString = event.filterString;

    return backendDataMock.observable;
  }
});

describe('stores.traceData', () => {
  let onNext;

  beforeEach(() => {
    onNext = sinon.stub();
  });

  it('should receive initial data', () => {
    mod.getTraceData().subscribe(onNext);

    // initial data
    expect(onNext).to.have.callCount(1);
  });

  it('should get new data if filtering changed', () => {
    mod.getTraceData().subscribe(onNext);

    // initial data
    expect(onNext).to.have.callCount(1);

    mod.setFilterString('tempFilterString');
    expect(filterString).to.equal('tempFilterString');
    expect(onNext).to.have.callCount(2);
  });

  it('should get new data if sorting changed', () => {
    mod.getTraceData().subscribe(onNext);

    // initial data
    expect(onNext).to.have.callCount(1);

    mod.setSortDirection('prop1', 'ascending');
    expect(sortingProperty).to.equal('prop1');
    expect(sortDirection).to.equal('ascending');
    expect(onNext).to.have.callCount(2);

    mod.setSortDirection('prop2', 'descending');
    expect(sortingProperty).to.equal('prop2');
    expect(sortDirection).to.equal('descending');
    expect(onNext).to.have.callCount(3);
  });

});
