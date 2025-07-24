/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useMemo } from 'react';

/**
 * Custom hook to manage selection state for filter panel
 */
export const useSelectionState = (selectedValues: string[], totalOptions: number) => {
  const allSelected = useMemo(() => {
    return selectedValues.length === totalOptions && totalOptions > 0;
  }, [selectedValues.length, totalOptions]);

  const isIndeterminate = useMemo(() => {
    return selectedValues.length > 0 && selectedValues.length < totalOptions;
  }, [selectedValues.length, totalOptions]);

  return { allSelected, isIndeterminate };
};
