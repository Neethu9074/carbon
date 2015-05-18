/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions, no-unused-vars, max-len */
'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import {create, combine} from './index';


describe('conveyer', () => {
  let Conveyer;
  let conveyerInstance;

  beforeEach(() => {
    Conveyer = sinon.stub();
    Conveyer.getUniqueId = (opts) => JSON.stringify(opts);
    conveyerInstance = {
      start: sinon.stub(),
      stop: sinon.stub()
    };
    Conveyer.onFirstCall().returns(conveyerInstance);
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
    subscription2.dispose();
    expect(conveyerInstance.stop.callCount).to.equal(1);
  });

  it('should forbid to reuse disposed observables', () => {
    const observable = create(Conveyer);
    observable.subscribe(() => {}).dispose();
    expect(() => observable.subscribe(() => {})).to.throw(Error);
  });

  it('should create new observable instances once all previous subscribers disposed', () => {
    const observable1 = create(Conveyer);
    observable1.subscribe(() => {}).dispose();
    const observable2 = create(Conveyer);
    expect(observable1).not.to.equal(observable2);
  });

  it('should make published values available via the observable', (done) => {
    create(Conveyer).subscribe(e => {
      expect(e).to.equal('foo');
      done();
    });
    const onNext = conveyerInstance.start.getCall(0).args[0];
    onNext('foo');
  });
});
