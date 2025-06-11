/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { actionCatalogFullyQualified, actionSummaryFullyQualified } from 'in-automation/navigation/paths';
import { actionDashboardUrlParameters } from 'in-automation/navigation/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-events/navigation/paths';

const idParameter = actionDashboardUrlParameters.id;

export default function useHrefToActionDashboard() {
  const { location, createHref } = useNavigation();
  const from = location.pathname;

  return (actionId?: string) => {
    location.pathname = actionSummaryFullyQualified;
    setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, actionId);
    if (from !== actionSummaryFullyQualified) {
      if (from === actionCatalogFullyQualified) {
        location.query['from'] = from;
      } else if (from === eventsPath) {
        location.query['from'] = from;
        location.query['eventState'] = JSON.stringify(location.matrix?.[eventsPath]);
      } else {
        delete location.query.from;
      }
    }
    return createHref(location);
  };
}
