/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import useShouldShowMissingDataIndicator from 'in-custom-dashboards/widgets/SloLegacy/hooks/useShouldShowMissingDataIndicator';
import { finishedProgress, indeterminateProgress } from 'in-services/fixedObjects';
import { days } from 'in-services/time';

describe('in-custom-dashboards/widgets/SloLegacy/hooks/useShouldShowMissingDataIndicator', () => {
  it('returns false if progress is loading', () => {
    // Given
    const props = {
      progress: indeterminateProgress
    };

    // When
    const { result } = renderHook(() => useShouldShowMissingDataIndicator(props));

    // Then
    const showMissingDataIndicators = result.current;
    expect(showMissingDataIndicators).toBeFalsy();
  });

  it('returns false if progress is finished and nonInteractive is true', () => {
    // Given
    const props = {
      progress: finishedProgress,
      nonInteractive: true
    };

    // When
    const { result } = renderHook(() => useShouldShowMissingDataIndicator(props));

    // Then
    const showMissingDataIndicators = result.current;
    expect(showMissingDataIndicators).toBeFalsy();
  });

  it('returns true if progress is finished, nonInteractive is false and the initialEvaluationTimestamp is within timeWindow', () => {
    // Given
    const initialEvaluationTimestamp = Date.now() - days.toMillis(0.5);
    const windowSize = days.toMillis(1);

    const props = {
      initialEvaluationTimestamp,
      timeConfig: { windowSize },
      progress: finishedProgress,
      nonInteractive: false
    };

    // When
    const { result } = renderHook(() => useShouldShowMissingDataIndicator(props));

    // Then
    const showMissingDataIndicators = result.current;
    expect(showMissingDataIndicators).toBeTruthy();
  });

  it('returns false if progress is finished, nonInteractive is false and the initialEvaluationTimestamp is not within timeWindow', () => {
    // Given
    const initialEvaluationTimestamp = Date.now() - days.toMillis(2);
    const windowSize = days.toMillis(1);

    const props = {
      initialEvaluationTimestamp,
      timeConfig: { windowSize },
      progress: finishedProgress,
      nonInteractive: false
    };

    // When
    const { result } = renderHook(() => useShouldShowMissingDataIndicator(props));

    // Then
    const showMissingDataIndicators = result.current;
    expect(showMissingDataIndicators).toBeFalsy();
  });
});
