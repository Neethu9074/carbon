/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

import { eventId as eventIdMatricParam } from 'in-events/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-events/navigation/paths';

/**
 * Hook to give a function to navigate to an event given an event id without changing the filters/dfq
 */
export function useNavigateToEvent() {
  const { location, navigate } = useNavigation();

  const navigateToEvent = (eventId: string) => {
    // Create a new location object based on the current one
    let targetLocation = { ...location };

    // Always set the pathname to eventsPath to ensure we're in the events view
    targetLocation.pathname = eventsPath;

    // Set the event ID as a matrix parameter
    setOrDeleteMatrixKey(targetLocation, eventsPath, eventIdMatricParam, eventId);

    // Navigate to the updated location
    navigate(targetLocation);
  };

  return navigateToEvent;
}
