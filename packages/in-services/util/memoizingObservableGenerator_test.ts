/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { Observable, create } from '@instana/observables';

import memoize from 'in-services/util/memoizingObservableGenerator';

describe('in-services/util/memoizingObservableGenerator', () => {
  let creator: (n: number) => Observable<number>;
  let subscriber: jest.Mock;
  let stop: jest.Mock;

  beforeEach(() => {
    stop = jest.fn();
    subscriber = jest.fn();
    creator = memoize<number, number>(
      arg => create<number>({ stop }).emit(arg),
      JSON.stringify.bind(JSON),
      100
    );
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
      arg => create<number>({ stop }).emit(arg),
      JSON.stringify.bind(JSON),
      ttiFunction
    );
    const observable = creator(4);

    observable.subscribe(() => {}).dispose();
    expect(ttiFunction.mock.calls.length).toEqual(1);
    expect(ttiFunction.mock.calls[0][0][0]).toEqual(4);

    return new Promise(resolve => stop.mockImplementation(resolve));
  });
});
