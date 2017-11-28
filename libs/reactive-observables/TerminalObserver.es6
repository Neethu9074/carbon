const noop = () => {};

export default {
  _init(parent, onNext, onError) {
    this._parent = parent;
    this._disposed = false;
    this._onNext = onNext;
    this._onError = onError;
    this._parent._addChild(this);
  },

  dispose() {
    if (!this._disposed) {
      this._disposed = true;
      // We guarantee that after a dispose, a subscriber will never
      // again receive a value. This is the most efficient way
      // to achieve this.
      this._onNext = noop;
      this._parent._removeChild(this);
    }
  },

  _emitError(error) {
    if (this._onError) {
      this._onError(error);
      return true;
    }

    return false;
  }
};
