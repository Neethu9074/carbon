// @flow
import Observer from './Observer';

const noop = () => {};

/**
 * The final target of an observable-/observer chain. This is what a call to subscribe() returns.
 *
 * Type parameters:
 * - C: The type of values this terminal observer *consumes*.
 */
export default class TerminalObserver<C> {
  _parent: Observer<any, C>;
  _disposed: boolean;
  _onNext: (data: ?C) => void;
  _onError: ?(error: any) => void;

  constructor(parent: Observer<any, C>) {
    this._parent = parent;
    this._disposed = false;
  }

  /**
   * A TerminalObserver can only be considered fully initialized and usable after _init has been called.
   * @param onNext the mandatory onNext handler for the TerminalObserver
   * @param onError the optional onError handler
   * @returns {TerminalObserver}
   */
  _init(onNext: (data: ?C) => void, onError: ?(error: any) => void): TerminalObserver<C> {
    // Splitting initialization between the constructor and the _init function is necessary due to the facts,
    // 1. that clients often refer to the observer object in the onNext handler they pass in (see once.es6 for
    //    an example, which calls observer.dispose() in its onNext handler, and
    // 2. the initialization code of the TerminalObserver calls this._parent._addChild(this) which might trigger that
    //    very onNext handler immediately during initialization when the parent has emitLatestOnSubscribe set to true.
    this._onNext = onNext;
    this._onError = onError;
    this._parent._addChild(this);
    return this;
  }

  dispose() {
    if (!this._disposed) {
      this._disposed = true;
      // We guarantee that after a dispose, a subscriber will never
      // again receive a value. This is the most efficient way
      // to achieve this.
      this._onNext = noop;
      this._parent._removeChild(this);
    }
  }

  // eslint-disable-next-line no-unused-vars
  _emitError(error: any, _: ?boolean): boolean {
    if (this._onError) {
      this._onError(error);
      return true;
    }

    return false;
  }
}
