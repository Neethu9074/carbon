/*eslint-env mocha */

import assert from 'assert';
import sinon from 'sinon';

import RoEmitter from './index';

const event = 'data';

describe('RoEmitter', function() {
  let emitter;

  beforeEach(function() {
    emitter = new RoEmitter();
  });

  it('should emit events when no observer is registered', function() {
    emitter.emit(event, 42);
  });

  it('should add observers and emit events synchronously', function() {
    var stub = sinon.stub();
    emitter.on(event).subscribe(stub);
    emitter.emit(event, 42);
    assert(stub.calledOnce);
    assert.equal(stub.getCall(0).args[0], 42);
  });

  it('should dispose observers individually via subscription', function() {
    var stub = sinon.stub();
    var subscription = emitter.on(event).subscribe(stub);

    emitter.emit(event, 42);
    subscription.dispose();
    emitter.emit(event, 43);

    assert(stub.calledOnce);
    assert.equal(stub.getCall(0).args[0], 42);
  });

  it('should dispose of all observers', function() {
    var stubOne = sinon.stub();
    emitter.on(event).subscribe(stubOne);
    var stubTwo = sinon.stub();
    emitter.on(event).subscribe(stubTwo);

    emitter.emit(event, 42);
    emitter.dispose();
    emitter.emit(event, 43);

    assert(stubOne.calledOnce);
    assert.equal(stubOne.getCall(0).args[0], 42);
    assert(stubTwo.calledOnce);
    assert.equal(stubTwo.getCall(0).args[0], 42);
  });

  it('should compose synchronously using linq-like operators', function() {
    var stubOne = sinon.stub();
    emitter
      .on(event)
      .filter(function(x) {
        return x < 10;
      })
      .map(function(x) {
        return x * x;
      })
      .subscribe(stubOne);

    var stubTwo = sinon.stub();
    emitter.on(event).subscribe(stubTwo);

    emitter.emit(event, 5);
    emitter.emit(event, 10);

    assert(stubOne.calledOnce);
    assert(stubTwo.calledTwice);
    assert.equal(stubOne.getCall(0).args[0], 25);
    assert.equal(stubTwo.getCall(0).args[0], 5);
    assert.equal(stubTwo.getCall(1).args[0], 10);
  });
});
