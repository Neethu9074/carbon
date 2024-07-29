/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useCallback, useEffect } from 'react';

import { useClearSelectedEvent } from 'in-stores/navigation/paths/eventPaths';

export default function useClearSelectedEventForInMap() {
  const clearSelectedEvent = useClearSelectedEvent();

  const handleClearSelectedEvent = useCallback(() => {
    clearSelectedEvent();
  }, [clearSelectedEvent]);

  useEffect(() => {
    window.addEventListener('clickedOutsideMap', handleClearSelectedEvent);
    return () => {
      window.removeEventListener('clickedOutsideMap', handleClearSelectedEvent);
    };
  }, [handleClearSelectedEvent]);

  return null;
}

