/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import * as sinon from 'sinon';

import { create } from './index';

describe('TerminalObserver', () => {
  let subscriber = sinon.SinonStub;

  beforeEach(() => {
    subscriber = sinon.stub();
  });

  describe('dispose', () => {
    let stop = sinon.stub();

    beforeEach(() => {
      stop = sinon.stub();
    });

    it('should call stop only once', () => {
      const stream = create({ stop });

      expect(stop.callCount).to.equal(0);

      const subscription = stream.subscribe(subscriber);

      subscription.dispose();
      subscription.dispose();
      expect(stop.callCount).to.equal(1);
    });
  });
});
