/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useEffect } from 'react';

import { startTourTriggered$ } from 'in-services/integrations/solis';

export const TourListener = () => {
  useEffect(() => {
    const subscription = startTourTriggered$.subscribe(event => {
      const clickedTourId = event.detail.id ?? event.detail;
      //@ts-expect-error WalkMeAPI is loaded during runtime using walkme script
      //the id of the smart walk-thru is taken from walkme editor
      WalkMeAPI.startFlowById(clickedTourId);
    });

    return () => {
      subscription.dispose?.();
    };
  }, []);

  return null;
};
