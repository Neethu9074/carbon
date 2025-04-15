/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { act, renderHook } from '@testing-library/react-hooks';

import useChildUniqueItemCount from 'in-settings/tabs/SecurityAndAccess/hooks/useChildUniqueItemCount';

describe('in-settings/tabs/SecurityAndAccess/hooks/useChildUniqueItemCount', () => {
  it('must return an item count of two after re-render, if two single items have been added separately', () => {
    // Given
    const itemSetA = ['foo'];
    const itemSetB = ['bar'];

    // When
    const { result, rerender } = renderHook(() => useChildUniqueItemCount());
    const [, addItems] = result.current;
    act(() => {
      addItems(itemSetA);
      addItems(itemSetB);
    });
    rerender();

    // Then
    const [itemCount] = result.current;
    expect(itemCount).toBe(2);
  });

  it('must return an item count of 1 if reset has been called before adding items', () => {
    // Given
    const itemSetA = ['foo'];
    const itemSetB = ['bar'];

    // When
    const { result, rerender } = renderHook(() => useChildUniqueItemCount());
    const [, addItems] = result.current;
    act(() => addItems(itemSetA));
    rerender();
    const [, , reset] = result.current;
    act(() => reset());
    act(() => addItems(itemSetB));
    rerender();

    // Then
    const [itemCount] = result.current;
    expect(itemCount).toBe(1);
  });

  it('must return an item count of 1 if duplicate items have been added', () => {
    // Given
    const itemSetA = ['foo'];
    const itemSetB = ['foo'];

    // When
    const { result, rerender } = renderHook(() => useChildUniqueItemCount());
    const [, addItems] = result.current;
    act(() => {
      addItems(itemSetA);
      addItems(itemSetB);
    });
    rerender();

    // Then
    const [itemCount] = result.current;
    expect(itemCount).toBe(1);
  });
});
