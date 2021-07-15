/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { create } from '@instana/observables';

import { createStore, createTrackingStore, allStates } from 'in-stores/store';

describe('in-stores/store', () => {
  let subscriber: jest.Mock;

  beforeEach(() => {
    subscriber = jest.fn();
  });

  describe('createStore', () => {
    it('must fail when the store already exists', () => {
      const name = generateStoreName();
      createStore({ name });

      expect(() => createStore({ name })).toThrow('Store (' + name + ') already exists');
    });

    it('must create a named store', () => {
      const name = generateStoreName();
      const store = createStore({ name, initialValue: 'foobar' });

      store.observable.subscribe(subscriber);
      expect(subscriber.mock.calls.length).toEqual(1);
      expect(subscriber.mock.calls[0][0]).toEqual('foobar');
      expect(allStates[name]).toEqual('foobar');
    });

    it('must expose the store values under allStates for debugging purposes', () => {
      const name = generateStoreName();
      const store = createStore({ name, initialValue: 'bla' });
      expect(allStates[name]).toEqual('bla');

      store.applyStateMutation(() => 'blub');
      expect(allStates[name]).toEqual('blub');
    });

    it('must free the observable so that all mutations go through applyStateMutation', () => {
      const name = generateStoreName();
      const store = createStore({ name });

      // Retaining the test case for JavaScript users
      // @ts-ignore
      expect(store.observable.emit).toEqual(undefined);
    });

    it('must inform subscribers about state transitions', () => {
      const name = generateStoreName();
      const store = createStore({ name });

      store.observable.subscribe(subscriber);
      expect(subscriber.mock.calls.length).toEqual(1);
      expect(subscriber.mock.calls[0][0]).toEqual(null);

      store.applyStateMutation(() => 'We want Mett!');
      expect(subscriber.mock.calls.length).toEqual(2);
      expect(subscriber.mock.calls[1][0]).toEqual('We want Mett!');
    });
  });

  describe('createTrackingStore', () => {
    it('must fail when the store already exists', () => {
      const name = generateStoreName();
      createTrackingStore({ name, observable: create() });
      expect(() => createTrackingStore({ name, observable: create() })).toThrow('Store (' + name + ') already exists');
    });

      it('must track the store states', () => {
        const name = generateStoreName();
        const observable = create();

        const emittedValue = 42;
        observable.emit(42);
        const store = createTrackingStore({ name, observable });
        store.observable.subscribe(subscriber);

        expect(allStates[name]).toEqual(emittedValue);
      });

      it('must not incur a performance overhead when no subscribers exist', () => {
        const name = generateStoreName();
        const observable = create();

        observable.emit(42);
        createTrackingStore({ name, observable });

        expect(allStates[name]).toEqual(undefined);
      });

      it('must expose a new observable to be subscribed on', () => {
        const name = generateStoreName();
        const observable = create();
        const emittedValue = 42;
        const store = createTrackingStore({ name, observable });
        store.observable.subscribe(subscriber);

        observable.emit(42);

        expect(subscriber.mock.calls.length).toEqual(1);
        expect(subscriber.mock.calls[0][0]).toEqual(emittedValue);
      });
  });

  let storeCounter = 0;
  function generateStoreName() {
    return 'test-store-' + storeCounter++;
  }
});
