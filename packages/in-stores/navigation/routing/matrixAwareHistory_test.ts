/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import createMemoryHistory from 'history/createMemoryHistory';
import { History } from 'history';
import sinon from 'sinon';

import { wrap, MatrixAwareHistory } from 'in-stores/navigation/routing/matrixAwareHistory';
import { emptyObject } from 'in-services/fixedObjects';

describe('in-stores/navigation/routing/matrixAwareHistory', () => {
  let originalHistory: History;
  let history: MatrixAwareHistory;
  let listener: sinon.SinonStub;

  beforeEach(() => {
    listener = sinon.stub();
    originalHistory = createMemoryHistory();
    sinon.spy(originalHistory, 'push');
    sinon.spy(originalHistory, 'replace');
    history = wrap(originalHistory);
    history.listen(listener);
  });

  it('must not emit anything initially', () => {
    expect(getLastEmittedLocation()).toEqual(null);
  });

  it('must set simple URL via string', () => {
    history.push('/foo?a=b');
    expect(getLastEmittedLocation()).toEqual({
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
      },
      matrix: emptyObject
    });
    expect(getLastEmittedLocation()).toEqual({
      pathname: '/foo',
      query: { a: 'b' },
      matrix: {
        '/foo': {}
      }
    });
  });

  it('must handle matrix URL', () => {
    history.push('/first;k=a%2Fb/second?a=b');
    expect(getLastEmittedLocation()).toEqual({
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

  function getLastEmittedLocation() {
    return getLastCallArg(listener);
  }

  function getLastCallArg(spy: sinon.SinonStub) {
    if (spy.callCount === 0) {
      return null;
    }
    return spy.getCall(spy.callCount - 1).args[0];
  }
});
