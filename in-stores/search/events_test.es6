/* eslint-env mocha */

import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';


describe('in-stores/search/events', () => {

  let rawQuery$;
  let mod;

  beforeEach(() => {
    resetStoreRegistry();
    rawQuery$ = create().emit('');
    mod = proxyquire('in-stores/search/events', {
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

  describe('eventtype in input', () => {
    describe('contains eventtype', () => {
      it('must not find unknown eventtype filter', () => {
        expect(mod.containsTagFilter('type = event', 'issue')).to.equal(false);
      });

      it('must find eventtyper filter', () => {
        expect(mod.containsTagFilter('type=incident', 'incident')).to.equal(true);
      });

      it('must find eventtype filter with quotes', () => {
        expect(mod.containsTagFilter('type ="incident"', 'incident')).to.equal(true);
      });

      it('must not find eventtype filters when other ones exist', () => {
        expect(mod.containsTagFilter('type ="foobar"', 'blub')).to.equal(false);
      });

      it('must not find eventtype filters when part of another key type', () => {
        expect(mod.containsTagFilter('type ="issue"', 'foobar')).to.equal(false);
      });
    });

    it('must add filter', () => {
      mod.setEventTypeFilter('issue');
      expectQueryToEqual('type="issue"');
    });

    it('must not add filter twice', () => {
      rawQuery$.emit('type=issue');
      mod.setEventTypeFilter('issue');
      expectQueryToEqual('type="issue"');
    });

    it('must not add filter twice via button', () => {
      mod.setEventTypeFilter('issue');
      mod.setEventTypeFilter('issue');
      expectQueryToEqual('type="issue"');
    });

    it('must remove filters', () => {
      mod.setEventTypeFilter('issue');
      mod.removeEventTypeFilter();
      expectQueryToEqual('');
    });

    it('must remove filters set via URL', () => {
      rawQuery$.emit('type=issue');
      mod.removeEventTypeFilter();
      expectQueryToEqual('');
    });

    it('must ignore other filters', () => {
      rawQuery$.emit('host.cpuCount > 2 type=incident');
      mod.setEventTypeFilter('issue');
      mod.removeEventTypeFilter();
      expectQueryToEqual('host.cpuCount > 2');
    });

    it('must ignore other filters', () => {
      rawQuery$.emit('host.cpuCount > 2 type=incident');
      mod.setEventTypeFilter('issue');
      expectQueryToEqual('host.cpuCount > 2 type="issue"');
    });

    it('must remove all eventtype filters', () => {
      rawQuery$.emit('host.cpuCount > 2 type="bar"');
      mod.removeEventTypeFilter();
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
