/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { isEmpty } from 'lodash';

import {
  alertsTabDetailsFullyQualified,
  dashboardTestAlertsTabDetailsFullyQualified
} from 'in-synthetics/navigation/paths';
import { alertsTabDetailsFullyQualified as mobileAlertsTabDetailsFullyQualified } from 'in-mobile-apps/navigation/paths';
import { alertsTabDetailsFullyQualified as websiteAlertsTabDetailsFullyQualified } from 'in-websites/navigation/paths';
import { infraAlertDetailsFullyQualifiedPath } from 'in-stores/navigation/paths/mainPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';

export default function useRemoveQueryFromNavigation(isClearQueryPath?: boolean) {
  const { createHref, location } = useNavigation();
  const currentLocation = useLocation();
  if (!isEmpty(location?.query)) {
    location.query = {};
  }
  if (!isEmpty(currentLocation?.query) && isClearQueryPath) {
    currentLocation.query = {};
  }
  return { createHref, location, currentLocation };
}

export function useCheckLocationPath(duplicateMode?: boolean, editMode?: boolean) {
  const currentLocation = useLocation();

  // if the `cancel` is clicked from create page we dont want to clear the query param
  if (!duplicateMode && !editMode) {
    return false;
  }

  // we want to clear query parameter from the location or else 'cancel' and return to prev page wont work
  const validPaths = [
    infraAlertDetailsFullyQualifiedPath,
    alertsTabDetailsFullyQualified,
    dashboardTestAlertsTabDetailsFullyQualified,
    websiteAlertsTabDetailsFullyQualified,
    mobileAlertsTabDetailsFullyQualified
  ];

  return validPaths.includes(currentLocation.pathname);
}
