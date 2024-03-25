/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { actionCatalogPath } from 'in-automation/navigation/paths';
import { getEntityHref } from 'in-settings/navigation/paths';
import { Action } from 'in-types';

export default function useNavigateToActionDetails() {
  const { goToPath } = useNavigation();

  return (action: Action) => {
    goToPath(getEntityHref(actionCatalogPath, action.id));
  };
}
