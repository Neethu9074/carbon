/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TimeConfig } from '@instana/types';

import {
  defaultServiceLevelObjectiveUrlParameters,
  setTimeWindowTypeUrlParameter
} from 'in-service-levels/navigation/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setTimeConfig } from 'in-stores/time/config';
import { minutes } from 'in-services/time/time';

const MAX_ZOOM_LEVEL = minutes.toMillis(1);

export default function useGetHighlightedTimeFrameUrl(): (highlightedTimeFrame?: TimeConfig) => string {
  const { location, createHref } = useNavigation();

  return highlightedTimeFrame => {
    if (highlightedTimeFrame) {
      const { to, windowSize, focusedMoment } = highlightedTimeFrame;
      const currentTo = to!;
      const currentFocusedMoment = focusedMoment!;
      const newWindowSize = windowSize <= MAX_ZOOM_LEVEL ? MAX_ZOOM_LEVEL : windowSize;
      const newFocusedMoment = currentFocusedMoment > currentTo ? to : currentFocusedMoment;

      setTimeConfig(location, {
        windowSize: newWindowSize,
        to,
        focusedMoment: newFocusedMoment,
        autoRefresh: false
      });

      setTimeWindowTypeUrlParameter(
        location,
        'SELECTED_TIME',
        defaultServiceLevelObjectiveUrlParameters.timeWindowType
      );
    }

    return createHref(location);
  };
}
