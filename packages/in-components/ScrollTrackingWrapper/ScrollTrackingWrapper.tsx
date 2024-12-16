/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useEffect, useState, useCallback } from 'react';
import * as React from 'react';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { PAGE_SCROLLED_BOTTOM } from 'in-services/tracking/tracking';
import { UI_INTERACTION } from 'in-services/util/constants';
import usePrevious from 'in-hooks/usePrevious';

interface Props {
  children: React.ReactNode;
}

export default function ScrollTrackingWrapper({ children }: Props) {
  const {
    location: { pathname }
  } = useNavigation();

  const { pageRootName, productArea } = getViewTrackingMetaData();

  const [isBottomReached, setIsBottomReached] = useState(false);
  const [isTrackingPerformed, setIsTrackingPerformed] = useState(false);

  const previousPathName = usePrevious(pathname);
  const isDifferentPathname = pathname !== previousPathName;

  const handleOnScroll = useCallback(() => {
    const scrollNode: Element = document.scrollingElement || document.documentElement;
    const scrollContainerBottomPosition = Math.round(scrollNode.scrollTop + window.innerHeight);
    const scrollPosition = Math.round(scrollNode.scrollHeight);

    if (scrollPosition <= scrollContainerBottomPosition) {
      setIsBottomReached(true);

      return;
    }

    setIsBottomReached(false);
  }, []);

  useEffect(() => {
    if (isBottomReached && !isTrackingPerformed) {
      if (pageRootName && productArea) {
        const data = {
          parentPageName: pageRootName,
          parentPageCategory: productArea,
          action: PAGE_SCROLLED_BOTTOM,
          path: pathname
        };
        eventTracker({ data, segmentEventName: UI_INTERACTION });
      }
      setIsTrackingPerformed(true);
    }
  }, [isBottomReached, isTrackingPerformed, pageRootName, pathname, productArea]);

  useEffect(() => {
    window.addEventListener('scroll', handleOnScroll);

    return () => {
      window.removeEventListener('scroll', handleOnScroll);

      setIsBottomReached(false);
    };
  }, [handleOnScroll]);

  // Prevent hit to be sent in case user is scrolling in the same page multiple times
  useEffect(() => {
    if (isDifferentPathname) {
      setIsTrackingPerformed(false);
    }
  }, [isDifferentPathname]);

  return children;
}
