/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useTransition } from 'transition-hook';
import { useState, useEffect } from 'react';

export const WIGGLE_ROOM = 150;

export default function useDuringTranstion(showSlideInContent: boolean, transitionDurationInMillis: number): Boolean {
  const { stage } = useTransition(showSlideInContent, transitionDurationInMillis);
  const [duringTransition, setDuringTransition] = useState(false);

  useEffect(() => {
    if (['enter', 'leave'].includes(stage)) {
      setDuringTransition(true);
      // As synchronisation is done using a setTimeout, the transition might not have ended after waiting
      // transitionDurationInMillis, so adding a WIGGLE_ROOM in case. It's better to delay effects until
      // after the transition is really finished, rather than near the end of it.
      const timeout = setTimeout(() => setDuringTransition(false), transitionDurationInMillis + WIGGLE_ROOM);
      return () => {
        clearTimeout(timeout);
      };
    }
    return;
  }, [stage, transitionDurationInMillis]);

  return duringTransition;
}
