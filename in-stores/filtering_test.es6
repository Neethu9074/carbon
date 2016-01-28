/* eslint-env mocha */

import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

import {resetStoreRegistry} from 'in-stores/store';

describe('in-stores/filtering', () => {
  let filteringStore;
  let subscriber;

  beforeEach(() => {
    subscriber = sinon.stub();
    resetStoreRegistry();
    filteringStore = proxyquire('in-stores/filtering', {});
  });

  it('should be empty initially', () => {
    filteringStore.filters$.subscribe(subscriber);
    expect(subscriber.getCall(0).args[0].size).to.equal(0);
  });

  it('should add tag filters', () => {
    const tag = 'foobar';
    filteringStore.addTagFilter(tag);
    filteringStore.filters$.subscribe(subscriber);
    expect(subscriber.getCall(0).args[0].size).to.equal(1);
    expect(subscriber.getCall(0).args[0].first().getIn(['options', 'tag']))
      .to.equal(tag);
  });

  it('should remove tag filters', () => {
    const tag = 'foobar';
    filteringStore.addTagFilter(tag);
    filteringStore.removeTagFilter(tag);
    filteringStore.filters$.subscribe(subscriber);
    expect(subscriber.getCall(0).args[0].size).to.equal(0);
  });

  it('should only remove the selected tag filter', () => {
    const tag = 'foobar';
    filteringStore.addTagFilter(tag);
    filteringStore.addTagFilter('bla');
    filteringStore.removeTagFilter(tag);
    filteringStore.filters$.subscribe(subscriber);
    expect(subscriber.getCall(0).args[0].size).to.equal(1);
  });

  it('should expose all filtered tags', () => {
    filteringStore.addTagFilter('foo');
    filteringStore.addTagFilter('bar');
    filteringStore.filteredTags$.subscribe(subscriber);
    expect(subscriber.getCall(0).args[0].toJS().sort())
      .to.deep.equal(['bar', 'foo']);
  });

  it('should remove all tag filters()', () => {
    filteringStore.addTagFilter('foo');
    filteringStore.addTagFilter('bar');
    filteringStore.removeAllTagFilters();
    filteringStore.filteredTags$.subscribe(subscriber);
    expect(subscriber.getCall(0).args[0].size).to.equal(0);
  });
});
