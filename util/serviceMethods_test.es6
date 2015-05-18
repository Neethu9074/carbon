/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions, max-len */
'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import {combine} from './serviceMethods';
import {create} from '../conveyer/index';


describe('conveyer', () => {
  let Conveyer, Conveyer2;
  let conveyerInstance, conveyerInstance2;

  beforeEach(() => {
    Conveyer = sinon.stub();
    Conveyer2 = sinon.stub();
    Conveyer.getUniqueId = (opts) => JSON.stringify(opts);
    Conveyer2.getUniqueId = (opts) => JSON.stringify(opts);
    conveyerInstance = {
      start: sinon.stub(),
      stop: sinon.stub()
    };
    conveyerInstance2 = {
      start: sinon.stub(),
      stop: sinon.stub()
    };
    Conveyer.onFirstCall().returns(conveyerInstance);
    Conveyer2.onFirstCall().returns(conveyerInstance2);
  });

  it('should combine different subscriptions', (done) => {
    const sub1 = create(Conveyer);
    const sub2 = create(Conveyer2);

    const combined = combine([sub1, sub2]).throttle(10);
    combined.subscribe(values => {
      expect(values.length).to.equal(2);
      expect(values[0]).to.equal('foo');
      expect(values[1]).to.equal('bar');
      done();
    });
    const onNext = conveyerInstance.start.getCall(0).args[0];
    onNext('foo');
    const onNext2 = conveyerInstance2.start.getCall(0).args[0];
    onNext2('bar');
  });
});
