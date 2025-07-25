/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useCallback, useEffect } from 'react';

import {
  addOrDeleteHighlightedTimeframeToParams,
  HighlightedTimeframe,
  TIMEFRAME_CHANGE_EVENT
} from 'in-stores/highlightedTimeframe';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

export default function useHandleHighlightedTimeframeUpdate() {
  const { location, navigate } = useNavigation();

  const handleHighlightedTimeframeUpdate = useCallback(
    (
      event: CustomEvent<{
        highlightedTimeframe: HighlightedTimeframe;
      }>
    ) => {
      const highlightedTimeframe = event.detail.highlightedTimeframe;

      if (!highlightedTimeframe) return;

      const [from, to] = highlightedTimeframe;

      addOrDeleteHighlightedTimeframeToParams(location, from, to);
      navigate(location);
    },
    [location, navigate]
  );

  useEffect(() => {
    document.addEventListener(TIMEFRAME_CHANGE_EVENT, handleHighlightedTimeframeUpdate as EventListener);
    return () => {
      document.removeEventListener(TIMEFRAME_CHANGE_EVENT, handleHighlightedTimeframeUpdate as EventListener);
    };
  }, [handleHighlightedTimeframeUpdate]);
}
