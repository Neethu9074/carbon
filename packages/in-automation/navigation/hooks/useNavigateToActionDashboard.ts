/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { actionDashboardUrlParameters } from 'in-automation/navigation/urlParameters';
import { actionDashboardFullyQualified } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const idParameter = actionDashboardUrlParameters.id;

export default function useNavigateToActionDashboard() {
  const { location, navigate } = useNavigation();

  return (actionId?: string) => {
    location.pathname = actionDashboardFullyQualified;
    setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, actionId);
    navigate(location);
  };
}
