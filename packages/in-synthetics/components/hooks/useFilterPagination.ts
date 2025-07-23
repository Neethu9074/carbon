/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useCallback, useState } from 'react';

/**
 * Custom hook to manage pagination state for filter panel
 */
export const useFilterPagination = (initialCount = 5, increment = 10) => {
  const [visibleItems, setVisibleItems] = useState(initialCount);

  const handleLoadMore = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setVisibleItems(prev => prev + increment);
    },
    [increment]
  );

  const resetPagination = useCallback(() => {
    setVisibleItems(initialCount);
  }, [initialCount]);

  return {
    visibleItems,
    handleLoadMore,
    resetPagination
  };
};
