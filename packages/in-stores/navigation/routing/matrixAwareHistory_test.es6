/* eslint-env mocha */
import createMemoryHistory from 'history/createMemoryHistory';
import { expect } from 'chai';
import sinon from 'sinon';

import { wrap } from 'in-stores/navigation/routing/matrixAwareHistory';

describe('in-stores/navigation/routing/matrixAwareHistory', () => {
  let originalHistory;
  let history;
  let listener;

  beforeEach(() => {
    listener = sinon.stub();
    originalHistory = createMemoryHistory();
    sinon.spy(originalHistory, 'push');
    sinon.spy(originalHistory, 'replace');
    history = wrap(originalHistory);
    history.listen(listener);
  });

  it('must not emit anything initially', () => {
    expect(getLastEmittedLocation()).to.deep.equal(null);
  });

  it('must set simple URL via string', () => {
    history.push('/foo?a=b');
    expect(getLastEmittedLocation()).to.deep.equal({
      pathname: '/foo',
      query: { a: 'b' },
      matrix: {
        '/foo': {}
      }
    });
  });

  it('must set simple URL via location object', () => {
    history.push({
      pathname: '/foo',
      query: {
        a: 'b'
      }
    });
    expect(getLastEmittedLocation()).to.deep.equal({
      pathname: '/foo',
      query: { a: 'b' },
      matrix: {
        '/foo': {}
      }
    });
  });

  it('must handle matrix URL', () => {
    history.push('/first;k=a%2Fb/second?a=b');
    expect(getLastEmittedLocation()).to.deep.equal({
      pathname: '/first/second',
      query: { a: 'b' },
      matrix: {
        '/first': {
          k: 'a/b'
        },
        '/second': {}
      }
    });
  });

  // this test is for testing a workaround of the issue in history.js
  it('must handle URL with percent encoded characters', () => {
    history.push('/first;k=a%2Fb%20c/second?a=b%20c');
    expect(getLastEmittedLocation()).to.deep.equal({
      pathname: '/first/second',
      query: { a: 'b c' }, // query param should not be encoded
      matrix: {
        '/first': {
          k: 'a/b%20c' // matrix param should be encoded
        },
        '/second': {}
      }
    });
  });

  function getLastEmittedLocation() {
    return getLastCallArg(listener);
  }

  function getLastCallArg(spy) {
    if (spy.callCount === 0) {
      return null;
    }
    return spy.getCall(spy.callCount - 1).args[0];
  }
});
