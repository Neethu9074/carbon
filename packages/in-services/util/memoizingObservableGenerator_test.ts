/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable, create } from '@instana/observables';

import memoize, { triggerCacheInvalidation } from 'in-services/util/memoizingObservableGenerator';

describe('in-services/util/memoizingObservableGenerator', () => {
  let creator: (n: number) => Observable<number>;
  let subscriber: jest.Mock;
  let stop: jest.Mock;

  beforeEach(() => {
    stop = jest.fn();
    subscriber = jest.fn();
    creator = memoize<number, number>(arg => create<number>({ stop }).emit(arg ?? -1), JSON.stringify.bind(JSON), 100);
  });

  it('must create new observable', () => {
    const observable = creator(4);
    observable.subscribe(subscriber);
    expect(subscriber.mock.calls[0][0]).toEqual(4);
  });

  it('must reuse existing observable on same id', () => {
    expect(creator(4)).toEqual(creator(4));
  });

  it('must create separate observable when ID differs', () => {
    expect(creator(4)).not.toEqual(creator(5));
  });

  it('must delay stop calls', async () => {
    const observable = creator(4);
    observable.subscribe(() => {}).dispose();
    // stop must be called async
    expect(stop.mock.calls.length).toEqual(0);
    // the stop function must eventually be called
    return new Promise(resolve => stop.mockImplementation(resolve));
  });

  it('must support TTI functions', async () => {
    const ttiFunction = jest.fn();
    ttiFunction.mockReturnValue(0);
    creator = memoize<number, number>(
      arg => create<number>({ stop }).emit(arg ?? -1),
      JSON.stringify.bind(JSON),
      ttiFunction
    );
    const observable = creator(4);

    observable.subscribe(() => {}).dispose();
    expect(ttiFunction.mock.calls.length).toEqual(1);
    expect(ttiFunction.mock.calls[0][0][0]).toEqual(4);

    return new Promise(resolve => stop.mockImplementation(resolve));
  });

  it('must clear cache when triggerCacheInvalidation is called', () => {
    // Get a reference to the first observable
    const firstObservable = creator(4);

    // Verify cache is working by getting the same reference
    expect(creator(4)).toBe(firstObservable);

    // Trigger cache invalidation
    triggerCacheInvalidation();

    // After invalidation, we should get a new observable instance
    const newObservable = creator(4);
    expect(newObservable).not.toBe(firstObservable);
  });

  it('must create new observables for all previously cached values after invalidation', () => {
    // Create and cache multiple observables
    const observable1 = creator(1);
    const observable2 = creator(2);

    // Verify cache is working
    expect(creator(1)).toBe(observable1);
    expect(creator(2)).toBe(observable2);

    // Trigger cache invalidation
    triggerCacheInvalidation();

    // All cached values should return new observables
    expect(creator(1)).not.toBe(observable1);
    expect(creator(2)).not.toBe(observable2);
  });

  it('must properly handle multiple invalidations', () => {
    // Get initial observable
    const observable1 = creator(4);

    // First invalidation
    triggerCacheInvalidation();
    const observable2 = creator(4);
    expect(observable2).not.toBe(observable1);

    // Second invalidation
    triggerCacheInvalidation();
    const observable3 = creator(4);
    expect(observable3).not.toBe(observable2);
  });

  it('must resubscribe to invalidation signal when cache was empty and then populated', () => {
    // Get initial observable and subscribe to it
    const observable1 = creator(4);
    const subscription = observable1.subscribe(() => {});

    // Dispose subscription which should eventually clear the cache
    subscription.dispose();

    // Wait for the cache to clear (after TTI timeout)
    return new Promise<void>(resolve => {
      stop.mockImplementationOnce(() => {
        // After cache is cleared, create a new observable
        const observable2 = creator(4);

        // Trigger invalidation
        triggerCacheInvalidation();

        // Should get a new observable after invalidation
        const observable3 = creator(4);
        expect(observable3).not.toBe(observable2);

        resolve();
      });
    });
  });
});
