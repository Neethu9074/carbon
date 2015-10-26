/* eslint-env mocha */

import {expect} from 'chai';
import sinon from 'sinon';

import {createStore, allStates} from './store';

describe('in-services/stores/store', () => {

  let subscriber;

  beforeEach(() => {
    subscriber = sinon.stub();
  });

  it('should create a named store', () => {
    const name = generateStoreName();
    const store = createStore({name, initialValue: 'foobar'});

    store.observable.subscribe(subscriber);
    expect(subscriber).to.have.callCount(1);
    expect(subscriber).to.have.been.calledWith('foobar');
    expect(allStates[name]).to.equal('foobar');
  });

  it('should expose the store values under allStates for debugging purposes', () => {
    const name = generateStoreName();
    const store = createStore({name, initialValue: 'bla'});
    expect(allStates[name]).to.equal('bla');

    store.applyStateMutation(() => 'blub');
    expect(allStates[name]).to.equal('blub');
  });

  it('should free the observable so that all mutations go through applyStateMutation', () => {
    const name = generateStoreName();
    const store = createStore({name});

    expect(() => store.observable.emit(42)).to.throw(/frozen/);
  });

  it('should inform subscribers about state transitions', () => {
    const name = generateStoreName();
    const store = createStore({name});

    store.observable.subscribe(subscriber);
    expect(subscriber).to.have.callCount(1);
    expect(subscriber).to.have.been.calledWith(null);

    store.applyStateMutation(() => 'We want Mett!');
    expect(subscriber).to.have.callCount(2);
    expect(subscriber).to.have.been.calledWith('We want Mett!');
  });

  let storeCounter = 0;
  function generateStoreName() {
    return 'test-store-' + storeCounter++;
  }
});
