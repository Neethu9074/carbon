/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { syntheticSmartAlertsFullScreen, syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';

export function useSmartAlertCreateUrl() {
  const { createHref, location } = useNavigation();
  const currentLocation = useLocation();
  const returnUrlWithParams = createHref(currentLocation);
  const navigateURL = updateCreatePathMatrixParams(location, returnUrlWithParams);
  return createHref(navigateURL);
}

function updateCreatePathMatrixParams(location: Location, returnUrlWithParams: string) {
  setOrDeleteMatrixKey(location, syntheticsDashboard, '');

  // Keep the cancelURL parameter at the end so that the URL parameters added are not mixed with the cancel URL.
  setOrDeleteMatrixKey(location, syntheticsDashboard, cancelUrl, returnUrlWithParams);

  location.pathname = syntheticSmartAlertsFullScreen;
  return location;
}
