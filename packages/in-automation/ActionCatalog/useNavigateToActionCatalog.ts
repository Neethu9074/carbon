/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { actionDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import { actionCatalogFullyQualified } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const idParameter = actionDetailsUrlParameters.id;

export default function useNavigateToActionCatalog() {
  const { location, navigate } = useNavigation();
  return () => {
    location.pathname = actionCatalogFullyQualified;
    setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, null);
    navigate(location);
  };
}
