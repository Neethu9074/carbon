/* eslint-env mocha */

import { create } from '@instana/observables';
import sinon from 'sinon';
import { expect } from 'chai';

import memoize from 'in-services/util/memoizingObservableGenerator';

describe('in-services/util/memoizingObservableGenerator', () => {
  let creator;
  let subscriber;
  let stop;

  beforeEach(() => {
    stop = sinon.stub();
    subscriber = sinon.stub();
    creator = memoize(arg => create({ stop }).emit(arg), JSON.stringify.bind(JSON));
  });

  it('should create new observable', () => {
    const observable = creator(4);
    observable.subscribe(subscriber);
    expect(subscriber).to.have.been.calledWith(4);
  });

  it('should reuse existing observable on same id', () => {
    expect(creator(4)).to.equal(creator(4));
  });

  it('should create separate observable when ID differs', () => {
    expect(creator(4)).not.to.equal(creator(5));
  });

  it('should delay stop calls', () => {
    const observable = creator(4);
    observable.subscribe(() => {}).dispose();
    expect(stop).to.have.callCount(0);
  });
});
