/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { actionDashboardUrlParameters } from 'in-automation/navigation/urlParameters';
import { actionSummaryFullyQualified } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const idParameter = actionDashboardUrlParameters.id;

export default function useHrefToActionDashboard() {
  const { location, createHref } = useNavigation();

  return (actionId?: string) => {
    location.pathname = actionSummaryFullyQualified;
    setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, actionId);
    return createHref(location);
  };
}
