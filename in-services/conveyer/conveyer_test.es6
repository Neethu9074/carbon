/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions, max-len */
import {expect} from 'chai';
import sinon from 'sinon';

import {create} from './conveyer';


describe('conveyer', () => {
  let clock;
  let Conveyer;
  let conveyerInstance;

  beforeEach(() => {
    clock = sinon.useFakeTimers();

    Conveyer = sinon.stub();
    Conveyer.getUniqueId = opts => JSON.stringify(opts);
    conveyerInstance = {
      start: sinon.stub(),
      stop: sinon.stub()
    };
    Conveyer.onFirstCall().returns(conveyerInstance);
  });

  afterEach(() => {
    clock.restore();
  });

  it('should return observable instances', () => {
    const observable = create(Conveyer);
    expect(observable.subscribe).to.be.instanceof(Function);
  });

  it('should pass options to conveyer constructor', () => {
    create(Conveyer, {id: 'pups'});
    expect(Conveyer.getCall(0).args[0]).to.deep.equal({id: 'pups'});
  });

  it('should always pass at least an empty options object', () => {
    create(Conveyer);
    expect(Conveyer.getCall(0).args[0]).to.deep.equal({});
  });

  it('should cache observable instances with same parameters', () => {
    const observable1 = create(Conveyer);
    const observable2 = create(Conveyer);
    expect(Conveyer.calledOnce).to.equal(true);
    expect(observable1).to.equal(observable2);
  });

  it('should create distinct conveyer for varying options', () => {
    const observable1 = create(Conveyer, {id: 1});
    const observable2 = create(Conveyer, {id: 2});
    expect(Conveyer.callCount).to.equal(2);
    expect(observable1).not.to.equal(observable2);
  });

  it('should start conveyer once somebody subscribes', () => {
    const observable = create(Conveyer);
    expect(conveyerInstance.start.callCount).to.equal(0);
    observable.subscribe(() => {});
    expect(conveyerInstance.start.callCount).to.equal(1);
  });

  it('should unsubscribe once everbody unsubscribes', () => {
    const subscription1 = create(Conveyer).subscribe(() => {});
    const subscription2 = create(Conveyer).subscribe(() => {});
    expect(conveyerInstance.stop.callCount).to.equal(0);
    subscription1.dispose();
    expect(conveyerInstance.stop.callCount).to.equal(0);

    // let time progress 5s to force a timeout tick. Since there is still
    // one subscriber, stop should not be invoked
    clock.tick(5000);
    expect(conveyerInstance.stop.callCount).to.equal(0);

    subscription2.dispose();
    // Conveyers should only be stopped after a small amount of time to avoid
    // rapid conveyer restarts.
    expect(conveyerInstance.stop.callCount).to.equal(0);

    clock.tick(1000);
    expect(conveyerInstance.stop.callCount).to.equal(1);
  });

  it('should make published values available via the observable', (done) => {
    create(Conveyer).subscribe(e => {
      expect(e).to.equal('foo');
      done();
    });
    const onNext = conveyerInstance.start.getCall(0).args[0];
    onNext('foo');
  });

  it('should reuse conveyer instances when the unsubscribe is only temporary', () => {
    const subscriber1 = sinon.stub();
    const conveyer1 = create(Conveyer);
    const subscription1 = conveyer1.subscribe(subscriber1);
    const onNext = conveyerInstance.start.getCall(0).args[0];
    onNext('A');
    expect(subscriber1).to.have.callCount(1);
    expect(subscriber1).to.have.been.calledWith('A');

    subscription1.dispose();
    clock.tick(500);

    expect(create(Conveyer)).to.equal(conveyer1);
  });

  it('should restart conveyer in pending stop', () => {
    let subscriber = sinon.stub();
    let subscription = create(Conveyer).subscribe(subscriber);
    const onNext = conveyerInstance.start.getCall(0).args[0];
    onNext('A');
    expect(subscriber).to.have.callCount(1);
    expect(subscriber).to.have.been.calledWith('A');

    subscription.dispose();
    clock.tick(500);
    subscriber = sinon.stub();
    subscription = create(Conveyer).subscribe(subscriber);
    expect(conveyerInstance.start).to.have.callCount(1);
    expect(conveyerInstance.stop).to.have.callCount(0);
    expect(subscriber).to.have.callCount(1);
    expect(subscriber).to.have.been.calledWith('A');

    clock.tick(5000);
    expect(conveyerInstance.stop).to.have.callCount(0);
  });
});
