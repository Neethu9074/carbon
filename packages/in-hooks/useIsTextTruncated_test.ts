/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { renderHook, act } from '@testing-library/react-hooks';

import { useIsTextTruncated, isEllipsisActive } from 'in-hooks/useIsTextTruncated';
import useResizeObserver from 'in-hooks/useResizeObserver';

jest.mock('in-hooks/useResizeObserver');
jest.mock('lodash', () => ({
  debounce: jest.fn(fn => {
    const mockDebounced = fn;
    mockDebounced.cancel = jest.fn();
    return mockDebounced;
  })
}));

describe('useIsTextTruncated', () => {
  const createMockElement = (scrollWidth: number, offsetWidth: number) => {
    const element = document.createElement('div');
    Object.defineProperties(element, {
      scrollWidth: { get: () => scrollWidth },
      offsetWidth: { get: () => offsetWidth }
    });
    return element;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useResizeObserver as jest.Mock).mockImplementation(() => ({
      ref: { current: null },
      width: 100
    }));
  });

  test('should initialize with isTruncated as false', () => {
    const mockContainerRef = { current: createMockElement(200, 200) };
    const mockContentRef = { current: createMockElement(200, 200) };

    (useResizeObserver as jest.Mock)
      .mockReturnValueOnce({ ref: mockContainerRef, width: 200 })
      .mockReturnValueOnce({ ref: mockContentRef, width: 200 });

    const { result } = renderHook(() => useIsTextTruncated());
    expect(result.current.isTruncated).toBe(false);
  });

  test('should return proper refs and widths', () => {
    const mockContainerRef = { current: createMockElement(200, 200) };
    const mockContentRef = { current: createMockElement(200, 200) };

    (useResizeObserver as jest.Mock)
      .mockReturnValueOnce({ ref: mockContainerRef, width: 300 })
      .mockReturnValueOnce({ ref: mockContentRef, width: 400 });

    const { result } = renderHook(() => useIsTextTruncated());

    expect(result.current.containerRef).toBe(mockContainerRef);
    expect(result.current.containerWidth).toBe(300);
    expect(result.current.contentRef).toBe(mockContentRef);
    expect(result.current.contentWidth).toBe(400);
  });

  test('should detect truncation when container has ellipsis', () => {
    const mockContainerRef = { current: createMockElement(250, 200) };
    const mockContentRef = { current: createMockElement(200, 200) };

    (useResizeObserver as jest.Mock)
      .mockReturnValueOnce({ ref: mockContainerRef, width: 200 })
      .mockReturnValueOnce({ ref: mockContentRef, width: 200 });

    const { result, rerender } = renderHook(() => useIsTextTruncated());

    act(() => {
      rerender();
    });

    expect(result.current.isTruncated).toBe(true);
  });

  test('should detect truncation when content has ellipsis', () => {
    const mockContainerRef = { current: createMockElement(200, 200) };
    const mockContentRef = { current: createMockElement(250, 200) };

    (useResizeObserver as jest.Mock)
      .mockReturnValueOnce({ ref: mockContainerRef, width: 200 })
      .mockReturnValueOnce({ ref: mockContentRef, width: 200 });

    const { result, rerender } = renderHook(() => useIsTextTruncated());

    act(() => {
      rerender();
    });

    expect(result.current.isTruncated).toBe(true);
  });

  test('should not check for ellipsis if refs are null', () => {
    (useResizeObserver as jest.Mock)
      .mockReturnValueOnce({ ref: { current: null }, width: 200 })
      .mockReturnValueOnce({ ref: { current: null }, width: 300 });

    const { result } = renderHook(() => useIsTextTruncated());

    expect(result.current.isTruncated).toBe(false);
  });

  test('should update truncation state when container width changes', () => {
    const mockContainerRef = { current: createMockElement(200, 200) };
    const mockContentRef = { current: createMockElement(200, 200) };

    (useResizeObserver as jest.Mock)
      .mockReturnValueOnce({ ref: mockContainerRef, width: 200 })
      .mockReturnValueOnce({ ref: mockContentRef, width: 200 });

    const { result, rerender } = renderHook(() => useIsTextTruncated());

    expect(result.current.isTruncated).toBe(false);

    const updatedContainerRef = { current: createMockElement(250, 200) };

    (useResizeObserver as jest.Mock)
      .mockReturnValueOnce({ ref: updatedContainerRef, width: 250 })
      .mockReturnValueOnce({ ref: mockContentRef, width: 200 });

    act(() => {
      rerender();
    });

    expect(result.current.isTruncated).toBe(true);
  });

  test('should update truncation state when content width changes', () => {
    const mockContainerRef = { current: createMockElement(200, 200) };
    const mockContentRef = { current: createMockElement(200, 200) };

    (useResizeObserver as jest.Mock)
      .mockReturnValueOnce({ ref: mockContainerRef, width: 200 })
      .mockReturnValueOnce({ ref: mockContentRef, width: 200 });

    const { result, rerender } = renderHook(() => useIsTextTruncated());

    expect(result.current.isTruncated).toBe(false);

    const updatedContentRef = { current: createMockElement(250, 200) };

    (useResizeObserver as jest.Mock)
      .mockReturnValueOnce({ ref: mockContainerRef, width: 200 })
      .mockReturnValueOnce({ ref: updatedContentRef, width: 250 });

    act(() => {
      rerender();
    });

    expect(result.current.isTruncated).toBe(true);
  });
});

describe('isEllipsisActive', () => {
  it('should return false when element is null', () => {
    const element = null;
    const result = isEllipsisActive(element);
    expect(result).toBe(false);
  });

  it('should return false when element has no text overflow', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'scrollWidth', { value: 200 });
    Object.defineProperty(element, 'offsetWidth', { value: 200 });

    const result = isEllipsisActive(element);
    expect(result).toBe(false);
  });

  it('should return false when element has offsetWidth greater than scrollWidth', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'scrollWidth', { value: 200 });
    Object.defineProperty(element, 'offsetWidth', { value: 220 });
    const result = isEllipsisActive(element);
    expect(result).toBe(false);
  });

  it('should return true when element has text overflow', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'scrollWidth', { value: 220 });
    Object.defineProperty(element, 'offsetWidth', { value: 200 });
    const result = isEllipsisActive(element);
    expect(result).toBe(true);
  });
});
