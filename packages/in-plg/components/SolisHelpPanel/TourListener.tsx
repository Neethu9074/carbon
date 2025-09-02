/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useEffect } from 'react';

import { getIdByTourId } from 'in-plg/components/SolisHelpPanel/solisTourMapper';
import { SOLIS_HELP_PANEL_TOUR_PREFIX } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { startTourTriggered$ } from 'in-services/integrations/solis';

export const TourListener = () => {
  const { trackCta } = useSegmentTracking();
  useEffect(() => {
    const subscription = startTourTriggered$.subscribe(event => {
      const clickedTourId = event.detail.id;
      const trackingId = SOLIS_HELP_PANEL_TOUR_PREFIX + getIdByTourId(clickedTourId);
      trackCta(trackingId);
      //@ts-expect-error WalkMeAPI is loaded during runtime using walkme script
      //the id of the smart walk-thru is taken from walkme editor
      WalkMeAPI.startFlowById(clickedTourId);
    });

    return () => {
      subscription.dispose?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
