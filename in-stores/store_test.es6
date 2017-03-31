/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { create } from 'reactive-observables';

import { createStore, createTrackingStore, allStates } from './store';

describe('in-stores/store', () => {
  let subscriber;

  beforeEach(() => {
    subscriber = sinon.stub();
  });

  describe('createStore', () => {
    it('should fail when the store already exists', () => {
      const name = generateStoreName();
      createStore({ name });

      expect(() => {
        createStore({ name });
      }).to.throw('Store (' + name + ') already exists');
    });

    it('should create a named store', () => {
      const name = generateStoreName();
      const store = createStore({ name, initialValue: 'foobar' });

      store.observable.subscribe(subscriber);
      expect(subscriber).to.have.callCount(1);
      expect(subscriber).to.have.been.calledWith('foobar');
      expect(allStates[name]).to.equal('foobar');
    });

    it('should expose the store values under allStates for debugging purposes', () => {
      const name = generateStoreName();
      const store = createStore({ name, initialValue: 'bla' });
      expect(allStates[name]).to.equal('bla');

      store.applyStateMutation(() => 'blub');
      expect(allStates[name]).to.equal('blub');
    });

    it('should free the observable so that all mutations go through applyStateMutation', () => {
      const name = generateStoreName();
      const store = createStore({ name });

      expect(store.observable.emit).to.equal(undefined);
    });

    it('should inform subscribers about state transitions', () => {
      const name = generateStoreName();
      const store = createStore({ name });

      store.observable.subscribe(subscriber);
      expect(subscriber).to.have.callCount(1);
      expect(subscriber).to.have.been.calledWith(null);

      store.applyStateMutation(() => 'We want Mett!');
      expect(subscriber).to.have.callCount(2);
      expect(subscriber).to.have.been.calledWith('We want Mett!');
    });
  });

  describe('createTrackingStore', () => {
    it('should fail when the store already exists', () => {
      const name = generateStoreName();
      createTrackingStore({ name, observable: create() });

      expect(() => {
        createTrackingStore({ name, observable: create() });
      }).to.throw('Store (' + name + ') already exists');
    });

    it('should track the store states', () => {
      const name = generateStoreName();
      const observable = create();

      const emittedValue = 42;
      observable.emit(42);
      const store = createTrackingStore({ name, observable });
      store.observable.subscribe(subscriber);

      expect(allStates[name]).to.equal(emittedValue);
    });

    it('should not incur a performance overhead when no subscribers exist', () => {
      const name = generateStoreName();
      const observable = create();

      observable.emit(42);
      createTrackingStore({ name, observable });

      expect(allStates[name]).to.equal(undefined);
    });

    it('should expose a new observable to be subscribed on', () => {
      const name = generateStoreName();
      const observable = create();
      const emittedValue = 42;
      const store = createTrackingStore({ name, observable });
      store.observable.subscribe(subscriber);

      observable.emit(42);

      expect(subscriber).to.have.callCount(1);
      expect(subscriber).to.have.been.calledWith(emittedValue);
    });
  });

  let storeCounter = 0;
  function generateStoreName() {
    return 'test-store-' + storeCounter++;
  }
});
