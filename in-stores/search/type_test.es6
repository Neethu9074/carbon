/* eslint-env mocha */

import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';


describe('in-stores/search/type', () => {

  let rawQuery$;
  let mod;

  beforeEach(() => {
    resetStoreRegistry();
    rawQuery$ = create().emit('');
    mod = proxyquire('in-stores/search/type', {
      'in-stores/search': {
        rawQuery$,
        mutateInputString(fn) {
          rawQuery$.once(rawQuery => rawQuery$.emit(fn(rawQuery)));
        }
      }
    });
  });

  it('must have an empty query initially', () => {
    expectQueryToEqual('');
  });

  describe('trace type in input', () => {
    describe('contains trace type', () => {
      it('must find types', () => {
        expect(mod.containsTypeFilter('type = eum', 'eum')).to.equal(true);
      });

      it('must understand filtering of eum', () => {
        expect(mod.containsTypeFilter('type != eum', 'eum')).to.equal(false);
      });

      it('must not assume that everything else is contained when using negation', () => {
        expect(mod.containsTypeFilter('type!=eum', 'backend')).to.equal(false);
      });
    });

    it('must add filter', () => {
      mod.setTypeFilter('eum');
      expectQueryToEqual('type="eum"');
    });

    it('must not add filter twice', () => {
      rawQuery$.emit('type=backend');
      mod.setTypeFilter('backend');
      expectQueryToEqual('type="backend"');
    });

    it('must not add filter twice via button', () => {
      mod.setTypeFilter('backend');
      mod.setTypeFilter('backend');
      expectQueryToEqual('type="backend"');
    });

    it('must remove filters', () => {
      mod.setTypeFilter('backend');
      mod.removeTypeFilter();
      expectQueryToEqual('');
    });

    it('must remove filters set via URL', () => {
      rawQuery$.emit('type=backend');
      mod.removeTypeFilter();
      expectQueryToEqual('');
    });

    it('must ignore other filters', () => {
      rawQuery$.emit('host.cpuCount > 2 type=incident');
      mod.setTypeFilter('backend');
      mod.removeTypeFilter();
      expectQueryToEqual('host.cpuCount > 2');
    });

    it('must ignore other filters', () => {
      rawQuery$.emit('host.cpuCount > 2 type=incident');
      mod.setTypeFilter('backend');
      expectQueryToEqual('host.cpuCount > 2 type="backend"');
    });

    it('must remove all trace type filters', () => {
      rawQuery$.emit('host.cpuCount > 2 type="bar"');
      mod.removeTypeFilter();
      expectQueryToEqual('host.cpuCount > 2');
    });
  });

  function expectQueryToEqual(expected) {
    const subscriber = sinon.stub();
    rawQuery$.subscribe(subscriber);
    expect(subscriber.callCount).to.equal(1);
    expect(subscriber.getCall(0).args[0] || '').to.equal(expected);
  }
});
