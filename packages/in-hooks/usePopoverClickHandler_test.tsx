/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { renderHook, act } from '@testing-library/react-hooks';

import usePopoverClickHandler from 'in-hooks/usePopoverClickHandler';

describe('in-hooks/usePopoverClickHander', () => {
  it('Initial state is closed', () => {
    const { result } = renderHook(() => usePopoverClickHandler());
    act(() => {
      expect(result.current.open).toBe(false);
    });
  });
  it('Toggle open', () => {
    const { result } = renderHook(() => usePopoverClickHandler());
    act(() => {
      result.current.toggle();
    });

    expect(result.current.open).toBe(true);
  });
});
