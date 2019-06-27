/*eslint-env mocha, node*/
/*global setTimeout:false*/
/*eslint-disable max-len*/

import { expect } from 'chai';
import sinon from 'sinon';

import { create, combineLatest, setUnhandledErrorHandler } from './index';

describe('reactive-observables', () => {
  let fullSubjectSpec;
  let reemitSpec;

  beforeEach(() => {
    fullSubjectSpec = {
      start: sinon.stub(),
      stop: sinon.stub(),
      emitLatestOnSubscribe: false
    };

    reemitSpec = createReemitSpec();
  });

  it('should create observable instances', () => {
    const ro = create(fullSubjectSpec);
    expect(ro.subscribe).to.be.a('function');
  });

  it('subscribe should return a disposable', () => {
    const disposable = create(fullSubjectSpec).subscribe(() => {});
    expect(disposable.dispose).to.be.a('function');
  });

  it('should allow chaining of emit', () => {
    const observable = create();
    expect(observable.emit(42)).to.equal(observable);
  });

  describe('startEvents', () => {
    it('should call `start` when the first observer registers', () => {
      const observable = create(fullSubjectSpec);
      observable.subscribe(() => {});
      expect(fullSubjectSpec.start.calledOnce).to.equal(true);
    });

    it('should not call `start` for successive subscriptions', () => {
      const observable = create(fullSubjectSpec);
      observable.subscribe(() => {});
      observable.subscribe(() => {});
      expect(fullSubjectSpec.start.calledOnce).to.equal(true);
    });

    it('should only call `start` when at least one terminal observer is registered', () => {
      const observer = create(fullSubjectSpec).map(() => {});
      expect(fullSubjectSpec.start.calledOnce).to.equal(false);
      const terminalObserver = observer.subscribe(() => {});
      expect(fullSubjectSpec.start.calledOnce).to.equal(true);
      terminalObserver.dispose();
      expect(fullSubjectSpec.stop.calledOnce).to.equal(true);
    });

    it('should not emit twice and immediately emitting as part of start event', () => {
      const observable = create({
        start() {
          observable.emit(42);
        },

        emitLatestOnSubscribe: true
      });

      const onNext = sinon.stub();
      observable.subscribe(onNext);
      expect(onNext.callCount).to.equal(1);
      expect(onNext.getCall(0).args[0]).to.equal(42);
    });
  });

  describe('disposing', () => {
    it('should call stop when the last subscription is disposed', () => {
      const observable = create(fullSubjectSpec);
      const observer1 = observable.subscribe(() => {});
      const observer2 = observable.subscribe(() => {});
      expect(fullSubjectSpec.stop.called).to.equal(false);
      observer2.dispose();
      expect(fullSubjectSpec.stop.called).to.equal(false);
      observer1.dispose();
      expect(fullSubjectSpec.stop.called).to.equal(true);
    });

    it('should handle unsubscribe during iteration over children', () => {
      const stub = sinon.stub();
      let observer1Called = false;

      const observable = create(fullSubjectSpec);
      const observer1 = observable.subscribe(() => {
        observer1.dispose();
        observer1Called = true;
      });
      observable.subscribe(stub);

      observable.emit('foo');
      expect(observer1Called).to.equal(true);
      expect(stub.callCount).to.equal(1);
    });
  });

  describe('error handling', () => {
    it('should handle errors that are emitted by the Observable', done => {
      const handler = sinon.stub();
      setUnhandledErrorHandler(handler);

      const observable = create(fullSubjectSpec);

      observable.errors().subscribe(error => {
        expect(error).to.be.an.instanceof(TypeError);
        expect(handler.called).to.equal(false);
        done();
      });

      observable.emitError(new TypeError());
    });

    it('should handle errors emitted by intermediate steps', done => {
      const observable = create(fullSubjectSpec);

      observable
        .map(() => {
          throw new TypeError();
        })
        .errors()
        .subscribe(error => {
          expect(error).to.be.an.instanceof(TypeError);
          done();
        });

      observable.emit('42');
    });

    it('should report unhandled errors', () => {
      const handler = sinon.stub();
      setUnhandledErrorHandler(handler);

      const observable = create(fullSubjectSpec);

      observable
        .map(() => {
          throw new TypeError();
        })
        .subscribe(() => {});
      observable.emit('42');
      expect(handler.calledOnce).to.equal(true);
      expect(handler.getCall(0).args[0]).to.be.instanceof(TypeError);
    });

    it('should report errors in complicated observable graphs', done => {
      const handler = sinon.stub();
      setUnhandledErrorHandler(handler);

      const observable = create(fullSubjectSpec);
      const mapped = observable.map(v => v * v);

      mapped.filter(v => v % 2 === 0).subscribe(() => {});
      const filtered = mapped.filter(v => v % 3 === 0);
      filtered.subscribe(() => {});

      filtered.errors().subscribe(error => {
        expect(error.message).to.equal('42');
        done();
      });

      observable.emitError(new TypeError('42'));
    });
  });

  describe('emitting latest on subscribe', () => {
    beforeEach(() => {
      fullSubjectSpec.emitLatestOnSubscribe = true;
    });

    it('root observable should emit on subscribe', () => {
      const observable = create(fullSubjectSpec);
      observable.emit(42);

      const handler = sinon.stub();
      observable.subscribe(handler);

      expect(handler.calledOnce).to.equal(true);
      expect(handler.getCall(0).args[0]).to.equal(42);
    });

    it('child observables should emit on subscribe', () => {
      const observable = create(fullSubjectSpec);

      const childObservable = observable.map(i => i * 2);
      observable.emit(21);

      const handler = sinon.stub();
      childObservable.subscribe(handler);

      expect(handler.calledOnce).to.equal(true);
      expect(handler.getCall(0).args[0]).to.equal(42);
    });
  });

  describe('operators', () => {
    describe('subscribe', () => {
      it('should call subscribe handlers', () => {
        const observable = create(fullSubjectSpec);
        const fn = sinon.stub();
        observable.subscribe(fn);
        observable.emit('42');
        expect(fn.calledOnce).to.equal(true);
        expect(fn.getCall(0).args[0]).to.equal('42');
      });
    });

    describe('scan', () => {
      it('should calculate max values', done => {
        let call = 0;

        const observable = create(fullSubjectSpec);
        observable.scan((accumulated, value) => Math.max(accumulated, value), 0).subscribe(data => {
          if (call === 0) {
            expect(data).to.equal(5);
          } else if (call === 1) {
            expect(data).to.equal(5);
          } else if (call === 2) {
            expect(data).to.equal(42);
            done();
          }
          call++;
        });

        observable.emit(5);
        observable.emit(3);
        observable.emit(42);
      });
    });

    describe('tap', () => {
      it('should inspect emitted values', () => {
        const tapper = sinon.stub();
        const subscriber = sinon.stub();
        const observable = create();
        observable.tap(tapper).subscribe(subscriber);

        observable.emit(3);

        expect(subscriber.callCount).to.equal(1);
        expect(subscriber.getCall(0).args[0]).to.equal(3);
        expect(tapper.callCount).to.equal(1);
        expect(tapper.getCall(0).args[0]).to.equal(3);
      });
    });

    describe('freeze', () => {
      it('should not manipulate the observable', () => {
        const subscriber = sinon.stub();
        const observable = create();
        observable.subscribe(subscriber);

        observable.emit(3);

        expect(subscriber.callCount).to.equal(1);
        expect(subscriber.getCall(0).args[0]).to.equal(3);
      });
    });

    describe('map', () => {
      it('should map by multiplying by 2', done => {
        let call = 0;

        const observable = create(fullSubjectSpec);
        observable.map(v => v * 2).subscribe(data => {
          if (call === 0) {
            expect(data).to.equal(6);
          } else if (call === 1) {
            expect(data).to.equal(12);
          } else if (call === 2) {
            expect(data).to.equal(20);
            done();
          }
          call++;
        });

        observable.emit(3);
        observable.emit(6);
        observable.emit(10);
      });
    });

    describe('filter', () => {
      it('should filter values', done => {
        let call = 0;

        const observable = create(fullSubjectSpec);
        observable.filter(v => v % 2 === 0).subscribe(data => {
          if (call === 0) {
            expect(data).to.equal(2);
          } else if (call === 1) {
            expect(data).to.equal(4);
            done();
          }
          call++;
        });

        observable.emit(2);
        observable.emit(3);
        observable.emit(4);
      });
    });
  });

  describe('skipFirst', () => {
    it('should skip the first value', () => {
      const subscriber = sinon.stub();
      const observable = create();

      observable.skipFirst().subscribe(subscriber);

      observable.emit(1);
      observable.emit(2);
      observable.emit(3);
      expect(subscriber.callCount).to.equal(2);
      expect(subscriber.getCall(0).args[0]).to.equal(2);
    });
  });

  describe('combineLatest', () => {
    it('should support immediate unsubscribe', () => {
      const source = create();
      combineLatest([source]).once(() => {});
      source.emit(42);
    });

    it('should combine empty list of values to empty array', () => {
      const observer = sinon.stub();
      combineLatest([]).subscribe(observer);
      expect(observer.called).to.equal(true);
      expect(observer.getCall(0).args[0]).to.deep.equal([]);
    });

    it('should combine latest values', () => {
      const o1 = create(fullSubjectSpec);
      const o2 = create(fullSubjectSpec);
      const o3 = create(fullSubjectSpec);

      const observer = sinon.stub();
      const combinedSubscriptions = combineLatest([o1, o2, o3]).subscribe(observer);
      expect(observer.called).to.equal(false);

      o1.emit('1.1');
      expect(observer.called).to.equal(false);

      o2.emit('2.1');
      expect(observer.called).to.equal(false);

      o3.emit('3.1');
      expect(observer.calledOnce).to.equal(true);
      expect(observer.getCall(0).args[0]).to.deep.equal(['1.1', '2.1', '3.1']);

      o2.emit('2.2');
      expect(observer.calledTwice).to.equal(true);
      expect(observer.getCall(1).args[0]).to.deep.equal(['1.1', '2.2', '3.1']);

      expect(fullSubjectSpec.stop.called).to.equal(false);
      combinedSubscriptions.dispose();
      expect(fullSubjectSpec.stop.calledThrice).to.equal(true);
    });

    it('should fire immediately when the data is immediately available', () => {
      const o1 = create().emit(1);
      const o2 = create().emit(2);
      const observer = sinon.stub();
      const o3 = combineLatest([o1, o2]);
      o3.subscribe(observer);
      expect(observer.calledOnce).to.equal(true);
      expect(observer.getCall(0).args[0]).to.deep.equal([1, 2]);
    });
  });

  describe('throttle', () => {
    it('should reduce the number of messages', done => {
      let call = 0;
      const observable = create(fullSubjectSpec);
      observable.throttle(50, { setTimeout, clearTimeout }).subscribe(data => {
        if (call === 0) {
          expect(data).to.equal(1);
        } else {
          expect(data).to.equal(5);
          done();
        }
        call++;
      });

      observable.emit(1);
      observable.emit(2);

      setTimeout(() => observable.emit(3), 10);
      setTimeout(() => observable.emit(4), 20);
      setTimeout(() => observable.emit(5), 50);
    });

    it('should not throttle for values of 0 millis', () => {
      const onNext = sinon.stub();
      const observable = create(fullSubjectSpec);
      observable.throttle(0).subscribe(onNext);

      observable.emit(1);
      observable.emit(2);

      expect(onNext.callCount).to.equal(2);
      expect(onNext.getCall(0).args[0]).to.equal(1);
      expect(onNext.getCall(1).args[0]).to.equal(2);
    });

    it('should reset on stop', done => {
      const observable = create();
      const start = Date.now();

      const throttled = observable.throttle(500, { setTimeout, clearTimeout });

      const subscription1 = throttled.subscribe(data => {
        expect(Date.now() - start).to.be.below(500);
        expect(data).to.equal('a');
      });

      observable.emit('a');
      setTimeout(() => {
        subscription1.dispose();

        throttled.subscribe(data => {
          expect(Date.now() - start).to.be.below(500);
          expect(data).to.equal('a');
          done();
        });
      }, 100);
    });
  });

  describe('distinct', () => {
    it('should only emit when the reference changed', () => {
      const observable = create();

      const handler = sinon.stub();
      observable.distinct().subscribe(handler);

      observable.emit('a');
      observable.emit('b');
      observable.emit('b');
      observable.emit('c');

      expect(handler.callCount).to.equal(3);
      expect(handler.getCall(0).args[0]).to.equal('a');
      expect(handler.getCall(1).args[0]).to.equal('b');
      expect(handler.getCall(2).args[0]).to.equal('c');
    });

    it('should allow custom distinct functions', () => {
      const observable = create();

      const handler = sinon.stub();
      observable.distinct((a, b) => a.toLowerCase() !== b.toLowerCase()).subscribe(handler);

      observable.emit('a');
      observable.emit('b');
      observable.emit('B');
      observable.emit('c');

      expect(handler.callCount).to.equal(3);
      expect(handler.getCall(0).args[0]).to.equal('a');
      expect(handler.getCall(1).args[0]).to.equal('b');
      expect(handler.getCall(2).args[0]).to.equal('c');
    });
  });

  describe('once', () => {
    it('should emit at most one time', () => {
      const observable = create();

      const handler = sinon.stub();
      observable.once(handler);

      observable.emit('a');
      observable.emit('b');

      expect(handler.callCount).to.equal(1);
      expect(handler.getCall(0).args[0]).to.equal('a');
    });

    it('should emit only once with initial data', () => {
      const observable = create(reemitSpec);
      observable.emit('a');

      const handler = sinon.stub();
      observable.once(handler);

      expect(handler.callCount).to.equal(1);
      expect(handler.getCall(0).args[0]).to.equal('a');

      observable.emit('b');
      expect(handler.callCount).to.equal(1);
    });

    it('should emit only once with initial data for each subscribers', () => {
      const observable = create(reemitSpec);
      observable.emit('a');

      const handlerA = sinon.stub();
      observable.once(handlerA);

      const handlerB = sinon.stub();
      observable.once(handlerB);

      const handlerC = sinon.stub();
      observable.once(handlerC);

      expect(handlerA.callCount).to.equal(1);
      expect(handlerA.getCall(0).args[0]).to.equal('a');
      expect(handlerB.callCount).to.equal(1);
      expect(handlerB.getCall(0).args[0]).to.equal('a');
      expect(handlerC.callCount).to.equal(1);
      expect(handlerC.getCall(0).args[0]).to.equal('a');

      observable.emit('b');
      expect(handlerA.callCount).to.equal(1);
      expect(handlerB.callCount).to.equal(1);
      expect(handlerC.callCount).to.equal(1);
    });

    it('should emit only once for each subscribers with async data', () => {
      const observable = create(reemitSpec);
      const mapped = observable.map(a => a + a);

      const handlerA = sinon.stub();
      mapped.once(handlerA);

      observable.emit('a');

      expect(handlerA.callCount).to.equal(1);
      expect(handlerA.getCall(0).args[0]).to.equal('aa');

      const handlerB = sinon.stub();
      mapped.once(handlerB);

      expect(handlerB.callCount).to.equal(1);
      expect(handlerB.getCall(0).args[0]).to.equal('aa');

      const handlerC = sinon.stub();
      mapped.once(handlerC);

      expect(handlerA.callCount).to.equal(1);
      expect(handlerA.getCall(0).args[0]).to.equal('aa');
      expect(handlerB.callCount).to.equal(1);
      expect(handlerB.getCall(0).args[0]).to.equal('aa');
      expect(handlerC.callCount).to.equal(1);
      expect(handlerC.getCall(0).args[0]).to.equal('aa');

      observable.emit('b');
      expect(handlerA.callCount).to.equal(1);
      expect(handlerB.callCount).to.equal(1);
      expect(handlerC.callCount).to.equal(1);
    });

    it('should retrieve initial value on subscribe', () => {
      const observable = create();
      observable.emit('a');

      const handler1 = sinon.stub();
      observable.once(handler1);

      const handler2 = sinon.stub();
      observable.once(handler2);

      expect(handler1.callCount).to.equal(1);
      expect(handler1.getCall(0).args[0]).to.equal('a');
    });
  });

  describe('transform', () => {
    it('should translate one observable to another one', done => {
      const observable = create(reemitSpec);

      const transformedObservable = observable.transform({
        emitLatestOnSubscribe: true,
        transform(v) {
          const o = create(reemitSpec);

          setTimeout(() => {
            o.emit(v * 2);
          }, 10);

          return o;
        }
      });

      transformedObservable.subscribe(v => {
        expect(v).to.equal(6);
        done();
      });
      observable.emit(3);
    });

    it('should only subscribe and call transformation functions when neccessary', () => {
      const sourceSubjectSpec = createReemitSpec();
      const sourceObservable = create(sourceSubjectSpec);
      const thirdPartySubjectSpec = createReemitSpec();
      const thirdPartyObservable = create(thirdPartySubjectSpec);
      const transformer = sinon.stub();
      transformer.returns(thirdPartyObservable);
      const targetObservable = sourceObservable.transform({
        emitLatestOnSubscribe: true,
        transform: transformer
      });

      // check that nothing happens as so long as nobody subscribes
      expect(sourceSubjectSpec.start.callCount).to.equal(0);
      expect(thirdPartySubjectSpec.start.callCount).to.equal(0);
      expect(transformer.callCount).to.equal(0);

      // once someone subscribes, the source observable should be observed
      const subscriber = sinon.stub();
      const subscription = targetObservable.subscribe(subscriber);
      expect(sourceSubjectSpec.start.callCount).to.equal(1);
      expect(thirdPartySubjectSpec.start.callCount).to.equal(0);
      expect(transformer.callCount).to.equal(0);

      // and when the source observable emits, the transformer will create
      // a new target observable
      sourceObservable.emit(5);
      expect(sourceSubjectSpec.start.callCount).to.equal(1);
      expect(transformer.callCount).to.equal(1);
      expect(transformer.getCall(0).args[0]).to.equal(5);
      expect(thirdPartySubjectSpec.start.callCount).to.equal(1);

      // once the target observable fires, the subscriber should get that
      // value
      thirdPartyObservable.emit(10);
      expect(subscriber.callCount).to.equal(1);
      expect(subscriber.getCall(0).args[0]).to.equal(10);

      // when the subscriber unsubscribes, everything should be stopped
      subscription.dispose();
      expect(sourceSubjectSpec.stop.callCount).to.equal(1);
      expect(thirdPartySubjectSpec.stop.callCount).to.equal(1);
    });

    it('should be possible to avoid retransforms', () => {
      const observable = create(reemitSpec);
      let transformCallCount = 0;

      const transformedObservable = observable.transform({
        emitLatestOnSubscribe: true,

        shouldRetransform(previousValue, nextValue) {
          return previousValue !== nextValue;
        },

        transform(v) {
          const o = create(reemitSpec);
          o.emit(v * 5);
          transformCallCount++;
          return o;
        }
      });

      const subscriber = sinon.stub();
      transformedObservable.subscribe(subscriber);
      observable.emit(3);
      observable.emit(4);
      observable.emit(4);
      observable.emit(5);
      observable.emit(5);

      expect(subscriber.callCount).to.equal(3);
      expect(transformCallCount).to.equal(3);
      expect(subscriber.getCall(0).args[0]).to.equal(15);
      expect(subscriber.getCall(1).args[0]).to.equal(20);
      expect(subscriber.getCall(2).args[0]).to.equal(25);
    });

    it('should handle stop before source observable emit', () => {
      const sourceSubjectSpec = createReemitSpec();
      const sourceObservable = create(sourceSubjectSpec);
      const transformer = sinon.stub();
      const onNext = sinon.stub();

      const subscription = sourceObservable
        .transform({
          emitLatestOnSubscribe: true,
          transform: transformer
        })
        .subscribe(onNext);
      subscription.dispose();
      sourceObservable.emit('foobar');

      expect(onNext.callCount).to.equal(0);
      expect(transformer.callCount).to.equal(0);
    });

    it('should loose the initial value after source observable changes its values', () => {
      const sourceObservable = create();
      sourceObservable.emit('a');
      const intermediateObservable1 = create();
      intermediateObservable1.emit(1);
      const intermediateObservable2 = create();
      const transformer = sinon.stub();
      transformer.onCall(0).returns(intermediateObservable1);
      transformer.onCall(1).returns(intermediateObservable2);
      const subscriber1 = sinon.stub();
      const subscriber2 = sinon.stub();

      const transformedObservable = sourceObservable.transform({
        emitLatestOnSubscribe: true,
        transform: transformer
      });
      transformedObservable.subscribe(subscriber1);
      sourceObservable.emit('b');

      transformedObservable.subscribe(subscriber2);
      intermediateObservable2.emit(2);
      expect(subscriber1.callCount).to.equal(2);
      expect(subscriber2.callCount).to.equal(1);
      expect(subscriber2.getCall(0).args[0]).to.equal(2);
    });
  });

  describe('nextFrame', () => {
    let originalRequestAnimationFrame;
    let requestAnimationFrameStub;

    beforeEach(() => {
      requestAnimationFrameStub = sinon.stub();

      // reuqestAnimationFrame results the request id of this entry in
      // the event loop
      requestAnimationFrameStub.returns(Math.random());
      originalRequestAnimationFrame = global.requestAnimationFrame;
      global.requestAnimationFrame = requestAnimationFrameStub;
    });

    afterEach(() => {
      global.requestAnimationFrame = originalRequestAnimationFrame;
    });

    it('should call subscribers on the next frame', () => {
      const onNext = sinon.stub();
      const observable = create();
      observable.nextFrame().subscribe(onNext);

      observable.emit(42);

      expect(onNext.callCount).to.equal(0);
      expect(requestAnimationFrameStub.callCount).to.equal(1);

      // simulate a frame
      requestAnimationFrameStub.getCall(0).args[0]();
      expect(onNext.callCount).to.equal(1);
      expect(onNext.getCall(0).args[0]).to.equal(42);
    });

    it('should discard multiple emits in a single frame', () => {
      const onNext = sinon.stub();
      const observable = create();
      observable.nextFrame().subscribe(onNext);

      observable.emit(42);
      observable.emit(43);
      observable.emit(44);

      expect(onNext.callCount).to.equal(0);
      expect(requestAnimationFrameStub.callCount).to.equal(1);

      // simulate a frame
      requestAnimationFrameStub.getCall(0).args[0]();
      expect(onNext.callCount).to.equal(1);
      expect(onNext.getCall(0).args[0]).to.equal(44);
    });

    it('should continue to emit on subsequent frames', () => {
      const onNext = sinon.stub();
      const observable = create();
      observable.nextFrame().subscribe(onNext);

      observable.emit(42);
      observable.emit(43);

      expect(onNext.callCount).to.equal(0);
      expect(requestAnimationFrameStub.callCount).to.equal(1);

      // simulate a frame
      requestAnimationFrameStub.getCall(0).args[0]();
      expect(onNext.callCount).to.equal(1);
      expect(onNext.getCall(0).args[0]).to.equal(43);

      observable.emit(44);
      observable.emit(45);

      // simulate a frame
      requestAnimationFrameStub.getCall(1).args[0]();
      expect(onNext.callCount).to.equal(2);
      expect(onNext.getCall(1).args[0]).to.equal(45);
    });
  });

  describe('startWith', () => {
    it('should start with a predefined value for the first child', () => {
      const onNext = sinon.stub();
      const observable = create();
      observable.startWith(42).subscribe(onNext);
      expect(onNext.callCount).to.equal(1);
      expect(onNext.getCall(0).args[0]).to.equal(42);
    });

    it('should use the provided value as the initial value for subsequent subscribers', () => {
      const sub1 = sinon.stub();
      const sub2 = sinon.stub();
      const observable = create().startWith(42);
      observable.subscribe(sub1);
      observable.subscribe(sub2);
      expect(sub1.callCount).to.equal(1);
      expect(sub1.getCall(0).args[0]).to.equal(42);
      expect(sub2.callCount).to.equal(1);
      expect(sub2.getCall(0).args[0]).to.equal(42);
    });

    it('should use the value emitter by start as new initial value', () => {
      const sub1 = sinon.stub();
      const sub2 = sinon.stub();
      const observable = create({
        start(o) {
          o.emit(43);
        }
      }).startWith(42);
      observable.subscribe(sub1);
      observable.subscribe(sub2);
      expect(sub1.callCount).to.equal(2);
      expect(sub1.getCall(0).args[0]).to.equal(42);
      expect(sub1.getCall(1).args[0]).to.equal(43);
      expect(sub2.callCount).to.equal(1);
      expect(sub2.getCall(0).args[0]).to.equal(43);
    });

    it('should restart emitting the last value once all unsubscribed', () => {
      const sub1 = sinon.stub();
      const sub2 = sinon.stub();
      const observable = create({
        start(o) {
          o.emit(43);
        }
      }).startWith(42);

      const disposable = observable.subscribe(sub1);
      disposable.dispose();

      observable.subscribe(sub2);
      expect(sub1.callCount).to.equal(2);
      expect(sub1.getCall(0).args[0]).to.equal(42);
      expect(sub1.getCall(1).args[0]).to.equal(43);
      expect(sub2.callCount).to.equal(2);
      expect(sub2.getCall(0).args[0]).to.equal(42);
      expect(sub2.getCall(1).args[0]).to.equal(43);
    });
  });

  describe('startWithFn', () => {
    it('should start with a calculated value for the first child', () => {
      const onNext = sinon.stub();
      const observable = create();
      observable.startWithFn(() => 'foobar').subscribe(onNext);
      expect(onNext.callCount).to.equal(1);
      expect(onNext.getCall(0).args[0]).to.equal('foobar');
    });
  });

  describe('delayedStop', () => {
    let stopSubscriber;
    let clock;

    beforeEach(() => {
      stopSubscriber = sinon.stub();
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should delay stop call on the observable', () => {
      const observable = create({
        stop: stopSubscriber
      }).delayedStop(200, sinon.stub(), setTimeout, clearTimeout);
      observable.subscribe().dispose();
      expect(stopSubscriber.callCount).to.equal(0);
    });

    it('should not break error handling', done => {
      const error = new TypeError('Something went wrong');
      const observable = create();
      observable
        .delayedStop(200, sinon.stub(), setTimeout, clearTimeout)
        .errors()
        .subscribe(e => {
          expect(e).to.equal(error);
          done();
        });
      observable.emitError(error);
    });

    it('should call stop after the specified amount of millis', () => {
      const observable = create({
        stop: stopSubscriber
      }).delayedStop(200, sinon.stub(), setTimeout, clearTimeout);
      observable.subscribe(() => {}).dispose();
      clock.tick(200);
      expect(stopSubscriber.callCount).to.equal(1);
    });

    it('should work with once subscribers', () => {
      const observable = create({
        start(o) {
          o.emit(42);
        },

        stop: stopSubscriber
      }).delayedStop(200, sinon.stub(), setTimeout, clearTimeout);
      observable.once(() => {}).dispose();
      expect(stopSubscriber.callCount).to.equal(0);
      clock.tick(200);
      expect(stopSubscriber.callCount).to.equal(1);
    });

    it('should not stop when a subscriber is added later on', () => {
      const observable = create({
        stop: stopSubscriber
      }).delayedStop(200, sinon.stub(), setTimeout, clearTimeout);
      observable.subscribe(() => {}).dispose();
      observable.subscribe(() => {});
      expect(stopSubscriber.callCount).to.equal(0);
      clock.tick(200);
      expect(stopSubscriber.callCount).to.equal(0);
    });

    it('should not schedule a stop when there are remaining subscribers', () => {
      const observable = create({
        stop: stopSubscriber
      }).delayedStop(200, sinon.stub(), setTimeout, clearTimeout);
      observable.subscribe(() => {});
      observable.subscribe(() => {}).dispose();
      expect(stopSubscriber.callCount).to.equal(0);
      clock.tick(200);
      expect(stopSubscriber.callCount).to.equal(0);
    });

    it('should stop when all subscribers are disposed', () => {
      const observable = create({
        stop: stopSubscriber
      }).delayedStop(200, sinon.stub(), setTimeout, clearTimeout);
      const subscription = observable.subscribe(() => {});
      observable.subscribe(() => {}).dispose();
      subscription.dispose();
      expect(stopSubscriber.callCount).to.equal(0);
      clock.tick(200);
      expect(stopSubscriber.callCount).to.equal(1);
    });

    it('should call the callback when delayed stop is executed', () => {
      const stopCb = sinon.stub();
      const observable = create().delayedStop(200, stopCb, setTimeout, clearTimeout);
      observable.subscribe(() => {}).dispose();
      expect(stopCb.callCount).to.equal(0);
      clock.tick(200);
      expect(stopCb.callCount).to.equal(1);
    });

    it('should call the callback after a conditioned number of millis ticked and paste the last emitted value', () => {
      const observable = create({
        start(o) {
          o.emit(42);
        },

        stop: stopSubscriber
      }).delayedStop(a => (a == 42 ? 300 : 200), sinon.stub(), setTimeout, clearTimeout);
      observable.once(() => {}).dispose();
      expect(stopSubscriber.callCount).to.equal(0);
      clock.tick(200);
      expect(stopSubscriber.callCount).to.equal(0);
      clock.tick(100);
      expect(stopSubscriber.callCount).to.equal(1);
    });

    it('should call the callback after a conditioned number of millis ticked and paste the last emitted value', () => {
      const observable = create({
        start(o) {
          o.emit(1337);
        },

        stop: stopSubscriber
      }).delayedStop(a => (a == 42 ? 300 : 200), sinon.stub(), setTimeout, clearTimeout);
      observable.once(() => {}).dispose();
      expect(stopSubscriber.callCount).to.equal(0);
      clock.tick(200);
      expect(stopSubscriber.callCount).to.equal(1);
      clock.tick(100);
      expect(stopSubscriber.callCount).to.equal(1);
    });

    it('should call the callback after a conditioned number of millis ticked', () => {
      const observable = create({
        stop: stopSubscriber
      }).delayedStop(a => (a == 42 ? 300 : 200), sinon.stub(), setTimeout, clearTimeout);
      observable.once(() => {}).dispose();
      expect(stopSubscriber.callCount).to.equal(0);
      clock.tick(200);
      expect(stopSubscriber.callCount).to.equal(1);
      clock.tick(100);
      expect(stopSubscriber.callCount).to.equal(1);
    });

    it('should not add itself twice to the parent', () => {
      const parentStart = sinon.stub();
      const parentStop = sinon.stub();
      const onDelayedStop = sinon.stub();
      const subscriber1 = sinon.stub();
      const subscriber2 = sinon.stub();

      const parent = create({
        start: parentStart,
        stop: parentStop
      });

      const child = parent.map(v => v * v).delayedStop(100, onDelayedStop, setTimeout, clearTimeout);

      const subscription1 = child.subscribe(subscriber1);
      expect(parentStart.callCount).to.equal(1);
      expect(parentStop.callCount).to.equal(0);
      expect(onDelayedStop.callCount).to.equal(0);

      subscription1.dispose();
      expect(parentStart.callCount).to.equal(1);
      expect(parentStop.callCount).to.equal(0);
      expect(onDelayedStop.callCount).to.equal(0);

      const subscription2 = child.subscribe(subscriber2);
      expect(parentStart.callCount).to.equal(1);
      expect(parentStop.callCount).to.equal(0);
      expect(onDelayedStop.callCount).to.equal(0);

      clock.tick(101);
      expect(parentStart.callCount).to.equal(1);
      expect(parentStop.callCount).to.equal(0);
      expect(onDelayedStop.callCount).to.equal(0);

      subscription2.dispose();
      expect(parentStart.callCount).to.equal(1);
      expect(parentStop.callCount).to.equal(0);
      expect(onDelayedStop.callCount).to.equal(0);

      clock.tick(101);
      expect(parentStart.callCount).to.equal(1);
      expect(parentStop.callCount).to.equal(1);
      expect(onDelayedStop.callCount).to.equal(1);
    });
  });

  describe('merge', () => {
    let subscriber;

    let observable1;
    let start1;
    let stop1;

    let observable2;
    let start2;
    let stop2;

    beforeEach(() => {
      subscriber = sinon.stub();

      start1 = sinon.stub();
      stop1 = sinon.stub();
      observable1 = create({
        start: start1,
        stop: stop1
      });

      start2 = sinon.stub();
      stop2 = sinon.stub();
      observable2 = create({
        start: start2,
        stop: stop2
      });
    });

    it('should emit nothing when chain is setup', () => {
      observable1.merge(observable2).subscribe(subscriber);

      expect(subscriber.callCount).to.equal(0);
    });

    it('should forward messages from both streams', () => {
      observable1.merge(observable2).subscribe(subscriber);

      observable1.emit(3);
      observable2.emit(4);

      expect(subscriber.callCount).to.equal(2);
      expect(subscriber.getCall(0).args[0]).to.equal(3);
      expect(subscriber.getCall(1).args[0]).to.equal(4);
    });

    it('should call start on both streams upon subscription', () => {
      observable1.merge(observable2).subscribe(subscriber);

      expect(start1.callCount).to.equal(1);
      expect(start2.callCount).to.equal(1);
    });

    it('should not call start when nobody is subscribed', () => {
      observable1.merge(observable2);

      expect(start1.callCount).to.equal(0);
      expect(start2.callCount).to.equal(0);
    });

    it('should call stop on both streams upon unsubscribe', () => {
      observable1
        .merge(observable2)
        .subscribe(subscriber)
        .dispose();

      expect(stop1.callCount).to.equal(1);
      expect(stop2.callCount).to.equal(1);
    });

    it('should not call stop when nobody is subscribed', () => {
      observable1.merge(observable2);

      expect(stop1.callCount).to.equal(0);
      expect(stop2.callCount).to.equal(0);
    });

    it('should not continue to send messages on immediate unsubscribe', () => {
      observable1.emit(42);
      observable2.emit(43);

      observable1.merge(observable2).once(subscriber);

      expect(subscriber.callCount).to.equal(1);
      expect(start1.callCount).to.equal(1);
      expect(start2.callCount).to.equal(1);
      expect(stop1.callCount).to.equal(1);
      expect(stop2.callCount).to.equal(1);
    });

    it('should emit on subscribe default', () => {
      const o = observable1.merge(observable2);
      observable1.emit(2);
      o.subscribe(() => {});
      o.subscribe(subscriber);
      expect(subscriber.getCall(0).args[0]).to.equal(2);
    });
  });

  function createReemitSpec() {
    return {
      start: sinon.stub(),
      stop: sinon.stub(),
      emitLatestOnSubscribe: true
    };
  }
});
