/* eslint-env mocha */

import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {cloneDeep} from 'lodash';
import {expect} from 'chai';
import sinon from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';

describe('in-components/SearchBar/stores/searchInputString', () => {

  let navigationParameters$;
  let mod;

  beforeEach(() => {
    resetStoreRegistry();
    navigationParameters$ = create().emit({query: {}});
    const mutateUrl = fn => {
      navigationParameters$.once(params => {
        navigationParameters$.emit(fn(cloneDeep(params)));
      });
    };
    mod = proxyquire('in-components/SearchBar/stores/searchInputString', {
      'in-stores/navigation': {
        mutateUrl,
        navigationParameters$
      }
    });
  });

  it('must have an empty query initially', () => {
    expectQueryToEqual('');
  });

  describe('tags in input', () => {
    describe('containsTagFilter', () => {
      it('must not find tag filters', () => {
        expect(mod.containsTagFilter('foo = tag', 'foobar')).to.equal(false);
      });

      it('must find tag filter', () => {
        expect(mod.containsTagFilter('tag = foobar', 'foobar')).to.equal(true);
      });

      it('must find tag filter with quotes', () => {
        expect(mod.containsTagFilter('tag ="foobar"', 'foobar')).to.equal(true);
      });

      it('must not find tag filters when other ones exist', () => {
        expect(mod.containsTagFilter('tag ="foobar"', 'blub')).to.equal(false);
      });

      it('must not find tag filters when part of another key type', () => {
        expect(mod.containsTagFilter('datag ="foobar"', 'blub')).to.equal(false);
      });
    });

    it('must add filter', () => {
      mod.addTagFilter('foobar');
      expectQueryToEqual('tag="foobar"');
    });

    it('must not add filter twice', () => {
      setQueryViaUrl('tag=foobar');
      mod.addTagFilter('foobar');
      expectQueryToEqual('tag=foobar');
    });

    it('must not add filter twice via button', () => {
      mod.addTagFilter('foobar');
      mod.addTagFilter('foobar');
      expectQueryToEqual('tag="foobar"');
    });

    it('must remove filters', () => {
      mod.addTagFilter('foobar');
      mod.removeTagFilter('foobar');
      expectQueryToEqual('');
    });

    it('must remove filters set via URL', () => {
      setQueryViaUrl('tag=foobar');
      mod.removeTagFilter('foobar');
      expectQueryToEqual('');
    });

    it('must not remove the wrong tag filter', () => {
      setQueryViaUrl('tag=foobar tag=bar');
      mod.removeTagFilter('foobar');
      expectQueryToEqual('tag=bar');
    });

    it('must ignore other filters', () => {
      setQueryViaUrl('host.cpuCount > 2 tag=bar');
      mod.addTagFilter('foobar');
      mod.removeTagFilter('bar');
      expectQueryToEqual('host.cpuCount > 2 tag="foobar"');
    });

    it('must remove all tag filters', () => {
      setQueryViaUrl('host.cpuCount > 2 tag="bar" tag=blub');
      mod.removeAllTagFilters();
      expectQueryToEqual('host.cpuCount > 2');
    });
  });

  function expectQueryToEqual(expected) {
    const subscriber = sinon.stub();
    navigationParameters$.subscribe(subscriber);
    expect(subscriber.callCount).to.equal(1);
    expect(subscriber.getCall(0).args[0].query.q || '').to.equal(encodeURIComponent(expected));
  }

  function setQueryViaUrl(q) {
    navigationParameters$.emit({query: {q: encodeURIComponent(q)}});
  }
});
