/*eslint-env mocha*/



import React from 'react/addons';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {expect} from 'chai';

import jsdom from 'in-test/jsdom';

const TestUtils = React.addons.TestUtils;

describe('in-components.ServerTime', () => {

  // Test time: Thu Aug 06 2015 19:30:24 GMT+0200 (CEST)
  const testMillis = 1438882224327;
  const testTime = '19:30:24';

  jsdom();

  let timeModule;
  let clock;
  let ServerTime;

  beforeEach(() => {
    timeModule = {
      getServerTime: sinon.stub()
    };

    timeModule.getServerTime.returns(testMillis);

    clock = sinon.useFakeTimers();

    ServerTime = proxyquire('./ServerTime', {
      'in-services/time': timeModule
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should hold a React component', () => {
    expect(ServerTime).to.be.an.instanceOf(Function);
  });

  it('should render a span element', () => {
    const comp = TestUtils.renderIntoDocument(
      <ServerTime />
    );
    expect(comp != null).to.equal(true);
  });

  it('should render the current time into the DOM node', () => {
    const comp = TestUtils.renderIntoDocument(<ServerTime />);
    const node = React.findDOMNode(comp);
    expect(node.innerHTML).to.equal(testTime);
  });

  it('should update the current time after one second', () => {
    const comp = TestUtils.renderIntoDocument(<ServerTime />);
    const node = React.findDOMNode(comp);

    timeModule.getServerTime.returns(testMillis + 5000);
    clock.tick(1000);
    expect(node.innerHTML).to.equal('19:30:29');
  });
});
