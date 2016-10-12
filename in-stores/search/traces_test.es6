/* eslint-env mocha */

import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';


describe('in-stores/search/traces', () => {

  let rawQuery$;
  let mod;

  beforeEach(() => {
    resetStoreRegistry();
    rawQuery$ = create().emit('');
    mod = proxyquire('in-stores/search/traces', {
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
        expect(mod.containsTraceTypeFilter('type = eum', 'eum')).to.equal(true);
      });

      it('must understand filtering of eum', () => {
        expect(mod.containsTraceTypeFilter('type != eum', 'eum')).to.equal(false);
      });

      it('must not assume that everything else is contained when using negation', () => {
        expect(mod.containsTraceTypeFilter('type!=eum', 'backend')).to.equal(false);
      });
    });

    it('must add filter', () => {
      mod.setTraceTypeFilter('eum');
      expectQueryToEqual('type="eum"');
    });

    it('must not add filter twice', () => {
      rawQuery$.emit('type=backend');
      mod.setTraceTypeFilter('backend');
      expectQueryToEqual('type="backend"');
    });

    it('must not add filter twice via button', () => {
      mod.setTraceTypeFilter('backend');
      mod.setTraceTypeFilter('backend');
      expectQueryToEqual('type="backend"');
    });

    it('must remove filters', () => {
      mod.setTraceTypeFilter('backend');
      mod.removeTraceTypeFilter();
      expectQueryToEqual('');
    });

    it('must remove filters set via URL', () => {
      rawQuery$.emit('type=backend');
      mod.removeTraceTypeFilter();
      expectQueryToEqual('');
    });

    it('must ignore other filters', () => {
      rawQuery$.emit('host.cpuCount > 2 type=incident');
      mod.setTraceTypeFilter('backend');
      mod.removeTraceTypeFilter();
      expectQueryToEqual('host.cpuCount > 2');
    });

    it('must ignore other filters', () => {
      rawQuery$.emit('host.cpuCount > 2 type=incident');
      mod.setTraceTypeFilter('backend');
      expectQueryToEqual('host.cpuCount > 2 type="backend"');
    });

    it('must remove all trace type filters', () => {
      rawQuery$.emit('host.cpuCount > 2 type="bar"');
      mod.removeTraceTypeFilter();
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
