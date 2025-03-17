/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { actionDetailsUrlParameters, actionCatalogUrlParameters } from 'in-automation/navigation/urlParameters';
import { actionCatalogFullyQualified } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const idParameter = actionDetailsUrlParameters.id;
const viewParameter = actionCatalogUrlParameters.view;

export default function useNavigateToActionCatalog() {
  const { location, navigate } = useNavigation();
  return (viewType = 'user') => {
    location.pathname = actionCatalogFullyQualified;
    setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, null);
    setOrDeleteMatrixKey(location, viewParameter.path ?? '', viewParameter.name, viewType);
    navigate(location);
  };
}
