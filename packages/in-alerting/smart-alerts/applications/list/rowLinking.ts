/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam,
  alertsCategory,
  applicationId as applicationIdMatrixParam
} from 'in-applications/navigation/matrix';
import {
  alertsTab,
  alertsTabDetailsFullyQualified,
  applicationDashboard,
  globalAlertDetails
} from 'in-applications/navigation/paths';
import { ApplicationSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { isCategoryLocal } from 'in-alerting/smart-alerts/components/list/constants';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-events/navigation/paths';
import { Location } from 'in-stores/navigation/types';

/**
 * Application specific Alert List links.
 * Creates links for each list row, based on given configsCategory (local or global).
 *
 * @param configsCategory compared with isCategoryLocal to check if AP-Id needs to be added.
 */
export function createRowLinkLocation(configsCategory: string) {
  const additionalMatrixKeys = isCategoryLocal(configsCategory)
    ? (config: ApplicationSmartAlertConfigWithMetadata) => [
        { key: applicationIdMatrixParam, value: config.applicationId }
      ]
    : (_config: ApplicationSmartAlertConfigWithMetadata) => [];

  return (config: ApplicationSmartAlertConfigWithMetadata, location: Location) => {
    const isGlobalAlertsPage = location?.pathname === alertsTab || location?.pathname === eventsPath;

    const pathname = isGlobalAlertsPage ? globalAlertDetails : alertsTabDetailsFullyQualified;
    const rowLinkLocation = { ...location, pathname };

    for (const { key, value } of additionalMatrixKeys(config)) {
      setOrDeleteMatrixKey(rowLinkLocation, applicationDashboard, key, value);
    }
    if (location?.pathname === eventsPath) {
      setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertsCategory, configsCategory);
    }

    setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertIdMatrixParam, config.id);
    setOrDeleteMatrixKey(rowLinkLocation, alertsTab, alertCreatedMatrixParam, config.created);

    return rowLinkLocation;
  };
}
