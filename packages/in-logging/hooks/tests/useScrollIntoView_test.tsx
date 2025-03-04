/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { renderHook, act } from '@testing-library/react-hooks';

import useScrollIntoView from 'in-logging/hooks/useScrollIntoView';

describe('useScrollIntoView - deps tests', () => {
  let scrollIntoViewMock: jest.Mock;

  beforeEach(() => {
    scrollIntoViewMock = jest.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handles empty deps array by default', () => {
    const { result } = renderHook(() => useScrollIntoView([], true));

    const element = document.createElement('div');
    result.current.current = element;

    act(() => {
      result.current.current?.scrollIntoView({ block: 'center' });
    });

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'center' });
  });
});
