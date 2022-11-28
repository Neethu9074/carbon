/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useEffect, useRef } from 'react';

/**
 * The loadMoreContainerRef which is returned by the hook should be used with an element that will trigger the
 * provided callback when visible in the viewport
 */
const useInfiniteScroll = (
  callback: (observerEntries: IntersectionObserverEntry[]) => void,
  dependencies: unknown[] = []
) => {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreContainerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (loadMoreContainerRef.current) {
      //making this async solves flakiness when the user scrolls too fast
      const resetObserver = () => {
        observerRef.current?.unobserve(loadMoreContainerRef.current!);
        observerRef.current = new IntersectionObserver(callback, { root: null, threshold: 0 });
        observerRef.current.observe(loadMoreContainerRef.current!);
      };
      setTimeout(resetObserver);
    }
  }, [...dependencies]);

  return [loadMoreContainerRef];
};

export default useInfiniteScroll;
