/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { renderHook, act } from '@testing-library/react-hooks';
import { create } from '@instana/observables';
import { expect } from 'chai';

import useCursorPagination from 'in-hooks/useCursorPagination';
import { success, error } from 'in-services/util/result';

describe('in-hooks/useCursorPagination', () => {
  it('must initially return pending progress', () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    expect(result.current.progress.loading).to.equal(true);
    expect(result.current.items).to.deep.equal([]);
  });

  it('must return items from observable', async () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    act(() => endpoint.emit(successResult({ items: [item(1), item(2)] })));

    expect(result.current.items).to.deep.equal([item(1), item(2)]);
    expect(result.current.progress.loading).to.deep.equal(false);
    expect(result.current.errors).to.deep.equal([]);
  });

  it('must return errors from observable', async () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    act(() => endpoint.emit(error([{ message: 'some error', code: 'SERVER' }])));

    expect(result.current.errors).to.deep.equal([{ message: 'some error', code: 'SERVER' }]);
  });

  it('must return time from observable', async () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    act(() => endpoint.emit({ time: 1234 }));

    expect(result.current.time).to.deep.equal(1234);
  });

  it('must return adjusted window size from observable', async () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    act(() => endpoint.emit({ adjustedWindowSize: 1234 }));

    expect(result.current.adjustedWindowSize).to.deep.equal(1234);
  });

  it('must load more if there are more items load via cursor on last item', async () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    act(() => endpoint.emit(successResult({ items: [item(1), item(2, '3')], canLoadMore: true })));

    expect(result.current.canLoadMore).to.equal(true);
    expect(result.current.items).to.deep.equal([item(1), item(2, '3')]);

    act(() => result.current.loadMore());

    expect(result.current.canLoadMore).to.equal(false);

    act(() => endpoint.emit(successResult({ items: [item(3)] })));

    expect(result.current.items).to.deep.equal([item(1), item(2, '3'), item(3)]);
    expect(result.current.canLoadMore).to.equal(false);
  });

  it('must load more if there are more items to load via top level next cursor', async () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    act(() => endpoint.emit(successResult({ items: [item(1), item(2)], next: '3', canLoadMore: true })));

    expect(endpoint.popRequest()).to.deep.equal({ cursor: undefined });
    expect(result.current.canLoadMore).to.equal(true);
    expect(result.current.items).to.deep.equal([item(1), item(2)]);

    act(() => result.current.loadMore());

    expect(result.current.canLoadMore).to.equal(false);

    act(() => endpoint.emit(successResult({ items: [item(3)] })));

    expect(endpoint.popRequest()).to.deep.equal({ cursor: '3' });
    expect(result.current.items).to.deep.equal([item(1), item(2), item(3)]);
    expect(result.current.canLoadMore).to.equal(false);
  });

  it('must return totalHits and totalRepresentedItemCount', async () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    act(() => endpoint.emit(successResult({ totalHits: 10, totalRepresentedItemCount: 20 })));

    expect(result.current.totalHits).to.equal(10);
    expect(result.current.totalRepresentedItemCount).to.equal(20);
  });

  it('must retain totalHits and totalRepresentedItemCount if not returned in subsquent requests', async () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    act(() =>
      endpoint.emit(
        successResult({
          items: [item(1), item(2)],
          next: '3',
          canLoadMore: true,
          totalHits: 10,
          totalRepresentedItemCount: 20
        })
      )
    );

    act(() => result.current.loadMore());

    act(() => endpoint.emit(successResult({ items: [item(3)], canLoadMore: false })));

    expect(result.current.totalHits).to.equal(10);
    expect(result.current.totalRepresentedItemCount).to.equal(20);
  });

  it('must return 0 totalHits and 0 totalRepresentedItemCount', async () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    act(() => endpoint.emit(successResult({ totalHits: 0, totalRepresentedItemCount: 0 })));

    expect(result.current.totalHits).to.equal(0);
    expect(result.current.totalRepresentedItemCount).to.equal(0);
  });

  it('must reload from first page', async () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    act(() =>
      endpoint.emit(
        successResult({
          items: [item(1), item(2)]
        })
      )
    );

    expect(endpoint.popRequest()).to.deep.equal({ cursor: undefined });

    act(() => result.current.reload());

    act(() =>
      endpoint.emit(
        successResult({
          items: [item('a'), item('b')]
        })
      )
    );

    expect(endpoint.popRequest()).to.deep.equal({ cursor: undefined });
  });

  it('must reload list when dependencies change', async () => {
    const endpoint = new MockEndpoint();

    const { result, rerender } = renderHook(type => useCursorPagination(endpoint.observableCreator(), [type]), {
      initialProps: 'numbers'
    });

    act(() =>
      endpoint.emit(
        successResult({
          items: [item(1), item(2)]
        })
      )
    );

    expect(endpoint.popRequest()).to.deep.equal({ cursor: undefined });
    expect(result.current.items).to.deep.equal([item(1), item(2)]);

    rerender('letters');

    act(() =>
      endpoint.emit(
        successResult({
          items: [item('a'), item('b')]
        })
      )
    );

    expect(endpoint.popRequest()).to.deep.equal({ cursor: undefined });
    expect(result.current.items).to.deep.equal([item('a'), item('b')]);
  });

  it('should not accept any more updates from the observable after receiving the result', async () => {
    const endpoint = new MockEndpoint();

    const { result } = renderHook(() => useCursorPagination(endpoint.observableCreator()), {
      initialProps: 'numbers'
    });

    act(() => endpoint.emit(successResult({ items: [item(1), item(2)] })));

    act(() => endpoint.emit(successResult({ items: [item(1), item(2)] })));

    expect(result.current.items).to.deep.equal([item(1), item(2)]);
  });
});

class MockEndpoint {
  constructor() {
    this.requests = [];
  }

  observableCreator() {
    return request => {
      this.requests.push(request);
      return (this.obs = create());
    };
  }

  emit(response) {
    this.obs.emit(response);
  }

  popRequest() {
    return this.requests.pop();
  }
}

const successResult = ({
  items = [item(1), item(2)],
  canLoadMore = false,
  totalHits,
  totalRepresentedItemCount,
  next
}) =>
  success({
    items,
    canLoadMore,
    totalHits,
    totalRepresentedItemCount,
    next
  });

function item(value, cursor) {
  return { value, cursor };
}
