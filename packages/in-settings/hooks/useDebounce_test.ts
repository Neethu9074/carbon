/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-hooks/dom';

import useDebounce from 'in-settings/hooks/useDebounce';

const DEBOUNCE_DELAY = 500;

describe('in-settings/hooks/useDebounce', () => {
  // Mock timers (for debounce)
  jest.useFakeTimers();

  test('should invoke function after delay has elapsed', async () => {
    await act(async () => {
      const setValid = jest.fn();

      renderHook(() => {
        const debouncedFunc = useDebounce(setValid, DEBOUNCE_DELAY);
        debouncedFunc();
      });

      // Delay has not been elapsed, function not called yet
      expect(setValid).not.toHaveBeenCalled();

      // Delay has been elapsed function should have been called
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
      expect(setValid).toHaveBeenCalled();
    });
  });
});
