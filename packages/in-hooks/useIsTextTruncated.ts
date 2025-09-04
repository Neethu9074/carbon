/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useCallback, useLayoutEffect, useState } from 'react';

import useResizeObserver from 'in-hooks/useResizeObserver';

export function isEllipsisActive(element: HTMLElement | null) {
  if (!element) {
    return false;
  }

  return element.scrollWidth > element.offsetWidth;
}

/**
 * See storybook for more documentation [./useIsTextTruncated.mdx]
 */
export function useIsTextTruncated<
  ContainerElementType extends HTMLElement = HTMLDivElement,
  ContentElementType extends HTMLElement = HTMLDivElement
>() {
  const { ref: containerRef, width: containerWidth } = useResizeObserver<ContainerElementType>();
  const { ref: contentRef, width: contentWidth } = useResizeObserver<ContentElementType>();
  const [isTruncated, setIsTruncated] = useState<boolean>(false);

  const checkForEllipsis = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;
    const isParentOverflowing = isEllipsisActive(containerRef.current);
    const isTextOverflowing = isEllipsisActive(contentRef.current);
    setIsTruncated(isParentOverflowing || isTextOverflowing);
  }, [containerRef, contentRef]);

  useLayoutEffect(() => {
    checkForEllipsis();
  }, [containerWidth, contentWidth, checkForEllipsis]);

  return {
    containerRef,
    containerWidth,
    contentRef,
    contentWidth,
    isTruncated
  };
}
