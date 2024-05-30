/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { actionCatalogFullyQualified, actionCatalog } from 'in-automation/navigation/paths';
import { actionDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import { createTabTypeUrlParameter } from 'in-automation/navigation/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const idParameter = actionDetailsUrlParameters.id;
const viewParameter = createTabTypeUrlParameter(actionCatalog);

export default function useNavigateToActionCatalog() {
  const { location, navigate } = useNavigation();
  return (viewType?: string) => {
    location.pathname = actionCatalogFullyQualified;

    const tabType = viewType ?? 'null';
    setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, null);
    setOrDeleteMatrixKey(location, viewParameter.path ?? '', viewParameter.name, tabType);
    //console.log('tessttttt,location', location);
    navigate(location);
  };
}
