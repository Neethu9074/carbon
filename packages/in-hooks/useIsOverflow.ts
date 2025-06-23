/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react';

interface UseIsOverflowParams {
  ref: React.RefObject<HTMLDivElement | undefined>;
  measureRef: React.RefObject<HTMLDivElement | undefined>;
  measurementOffset?: number;
  maxVisibleCount?: number;
  callback?: (hasOverflow: boolean) => void;
  overflowTag: React.RefObject<HTMLDivElement | undefined>;
}

export default function useIsOverflow({
  ref,
  measureRef,
  measurementOffset = 0,
  callback,
  maxVisibleCount = 10,
  overflowTag
}: UseIsOverflowParams) {
  const [isOverflow, setIsOverflow] = useState<boolean | undefined>(undefined);
  const sizingTags = Array.from(measureRef.current?.childNodes ?? []) as HTMLElement[];
  const [displayCount, setDisplayCount] = useState(0);

  const checkFullyVisibleTags = useCallback(() => {
    if (!ref.current) return;

    let willFit = 0;
    if (sizingTags.length > 0) {
      let spaceAvailable = ref.current.offsetWidth - measurementOffset;
      if (displayCount < sizingTags.length) {
        if (!overflowTag.current) return;
        spaceAvailable = spaceAvailable - overflowTag.current.offsetWidth;
      }

      for (const i in sizingTags) {
        const tagWidth = sizingTags[i]?.offsetWidth || 0;

        if (spaceAvailable >= tagWidth) {
          spaceAvailable -= tagWidth;
          willFit += 1;
        } else {
          break;
        }
      }

      if (willFit < sizingTags.length && overflowTag.current) {
        while (willFit > 0 && spaceAvailable < overflowTag.current.offsetWidth) {
          // Highly unlikely any useful tag is smaller
          willFit -= 1; // remove one tag
          spaceAvailable += sizingTags[willFit].offsetWidth;
        }
      }
    }

    if (willFit < 1) {
      setDisplayCount(0);
    } else {
      setDisplayCount(maxVisibleCount ? Math.min(willFit, maxVisibleCount) : willFit);
    }
  }, [sizingTags, ref, measurementOffset, maxVisibleCount, overflowTag, displayCount]);

  useEffect(() => {
    checkFullyVisibleTags();
  }, [checkFullyVisibleTags, sizingTags]);

  useLayoutEffect(() => {
    const trigger = () => {
      if (!measureRef.current || !ref.current) return;

      const hasOverflow = measureRef.current.offsetWidth > ref.current.offsetWidth - measurementOffset;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if (ref.current) {
      trigger();
    }
  }, [callback, ref, measureRef, measurementOffset]);

  return {
    isOverflow,
    displayCount
  };
}
