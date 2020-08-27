/* eslint-env mocha */

import { renderHook } from '@testing-library/react-hooks';
import { create } from 'reactive-observables';
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

    const { result, rerender } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    endpoint.emit(successResult({ items: [item(1), item(2)] }));

    rerender();

    expect(result.current.items).to.deep.equal([item(1), item(2)]);
  });

  it('must return errors from observable', async () => {
    const endpoint = new MockEndpoint();

    const { result, rerender } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    endpoint.emit(error([{ message: 'some error', code: 'SERVER' }]));

    rerender();

    expect(result.current.errors).to.deep.equal([{ message: 'some error', code: 'SERVER' }]);
  });

  it('must return time from observable', async () => {
    const endpoint = new MockEndpoint();

    const { result, rerender } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    endpoint.emit({ time: 1234 });

    rerender();

    expect(result.current.time).to.deep.equal(1234);
  });

  it('must return adjusted window size from observable', async () => {
    const endpoint = new MockEndpoint();

    const { result, rerender } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    endpoint.emit({ adjustedWindowSize: 1234 });

    rerender();

    expect(result.current.adjustedWindowSize).to.deep.equal(1234);
  });

  it('must load more if there are more items load via cursor on last item', async () => {
    const endpoint = new MockEndpoint();

    const { result, rerender } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    endpoint.emit(successResult({ items: [item(1), item(2, '3')], canLoadMore: true }));

    rerender();

    expect(result.current.canLoadMore).to.equal(true);
    expect(result.current.items).to.deep.equal([item(1), item(2, '3')]);

    result.current.loadMore();

    endpoint.emit(successResult({ items: [item(3)] }));

    rerender();

    expect(result.current.items).to.deep.equal([item(1), item(2, '3'), item(3)]);
  });

  it('must load more if there are more items to load via top level next cursor', async () => {
    const endpoint = new MockEndpoint();

    const { result, rerender } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    endpoint.emit(successResult({ items: [item(1), item(2)], next: '3', canLoadMore: true }));

    rerender();

    expect(endpoint.popRequest()).to.deep.equal({ cursor: undefined });
    expect(result.current.canLoadMore).to.equal(true);
    expect(result.current.items).to.deep.equal([item(1), item(2)]);

    result.current.loadMore();

    endpoint.emit(successResult({ items: [item(3)] }));

    rerender();

    expect(endpoint.popRequest()).to.deep.equal({ cursor: '3' });
    expect(result.current.items).to.deep.equal([item(1), item(2), item(3)]);
  });

  it('must return totalHits and totalRepresentedItemCount', async () => {
    const endpoint = new MockEndpoint();

    const { result, rerender } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    endpoint.emit(successResult({ totalHits: 10, totalRepresentedItemCount: 20 }));

    rerender();

    expect(result.current.totalHits).to.equal(10);
    expect(result.current.totalRepresentedItemCount).to.equal(20);
  });

  it('must retain totalHits and totalRepresentedItemCount if not returned in subsquent requests', async () => {
    const endpoint = new MockEndpoint();

    const { result, rerender } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    endpoint.emit(
      successResult({
        items: [item(1), item(2)],
        next: '3',
        canLoadMore: true,
        totalHits: 10,
        totalRepresentedItemCount: 20
      })
    );

    rerender();

    result.current.loadMore();

    endpoint.emit(successResult({ items: [item(3)], canLoadMore: false }));

    rerender();

    expect(result.current.totalHits).to.equal(10);
    expect(result.current.totalRepresentedItemCount).to.equal(20);
  });

  it('must reload from first page', async () => {
    const endpoint = new MockEndpoint();

    const { result, rerender } = renderHook(() => useCursorPagination(endpoint.observableCreator()));

    endpoint.emit(
      successResult({
        items: [item(1), item(2)]
      })
    );

    rerender();

    expect(endpoint.popRequest()).to.deep.equal({ cursor: undefined });

    result.current.reload();

    endpoint.emit(
      successResult({
        items: [item('a'), item('b')]
      })
    );

    rerender();

    expect(endpoint.popRequest()).to.deep.equal({ cursor: undefined });
  });

  it('must reload list when dependencies change', async () => {
    const endpoint = new MockEndpoint();

    const { result, rerender } = renderHook(type => useCursorPagination(endpoint.observableCreator(), [type]), {
      initialProps: 'numbers'
    });

    endpoint.emit(
      successResult({
        items: [item(1), item(2)]
      })
    );

    rerender();

    expect(endpoint.popRequest()).to.deep.equal({ cursor: undefined });
    expect(result.current.items).to.deep.equal([item(1), item(2)]);

    rerender('letters');

    endpoint.emit(
      successResult({
        items: [item('a'), item('b')]
      })
    );

    rerender();

    expect(endpoint.popRequest()).to.deep.equal({ cursor: undefined });
    expect(result.current.items).to.deep.equal([item('a'), item('b')]);
  });
});

class MockEndpoint {
  constructor() {
    this.requests = [];
    this.obs = create();
  }

  observableCreator() {
    return request => {
      this.requests.push(request);
      return this.obs;
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
