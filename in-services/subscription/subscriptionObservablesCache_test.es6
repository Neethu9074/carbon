/* eslint-env mocha */
import {create} from 'reactive-observables';
import sinon from 'sinon';
import {expect} from 'chai';

import createObservableIfMissing from './subscriptionObservablesCache';

describe('in-service.subscriptionObservablesCache', () => {
  let factory;

  beforeEach(() => {
    factory = {
      getId: sinon.stub(),
      createObservable: sinon.stub()
    };
  });

  it('should create new observable', () => {
    const opts = 'some opts';
    factory.getId.returns('some-id');
    factory.createObservable.returns(create());

    createObservableIfMissing(factory, opts);

    expect(factory.getId).to.have.callCount(1);
    expect(factory.getId).to.have.been.calledWith(opts);
    expect(factory.createObservable).to.have.callCount(1);
    expect(factory.createObservable).to.have.been.calledWith(opts);
  });

  it('should reuse existing observable on same id', () => {
    const opts = 'some opts';
    factory.getId.returns('some-id');
    factory.createObservable.returns(create());
    const firstObservable = createObservableIfMissing(factory, opts);

    const secondObservable = createObservableIfMissing(factory, opts);

    expect(factory.getId).to.have.callCount(2);
    expect(factory.getId).to.have.been.calledWith(opts);
    expect(factory.createObservable).to.have.callCount(1);
    expect(factory.createObservable).to.have.been.calledWith(opts);
    expect(secondObservable).to.equal(firstObservable);
  });

  it('should create separate observable when ID differs', () => {
    const opts = 'some opts';
    factory.getId.returns('some-id');
    factory.createObservable.returns(create());
    const firstObservable = createObservableIfMissing(factory, opts);

    factory.getId.returns('another-id');
    factory.createObservable.returns(create());
    const secondObservable = createObservableIfMissing(factory, opts);

    expect(factory.getId).to.have.callCount(2);
    expect(factory.getId).to.have.been.calledWith(opts);
    expect(factory.createObservable).to.have.callCount(2);
    expect(factory.createObservable).to.have.been.calledWith(opts);
    expect(secondObservable).not.to.equal(firstObservable);
  });

  it('should delay stop calls', () => {
    const start = sinon.stub();
    const stop = sinon.stub();
    factory.getId.returns('stop calls');
    factory.createObservable.returns(create({start, stop}));

    const observable = createObservableIfMissing(factory);
    const subscription = observable.subscribe(() => {});
    expect(start).to.have.callCount(1);

    subscription.dispose();
    expect(stop).to.have.callCount(0);
  });
});
