/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { actionDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import { actionDetailsFullyQualified } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const idParameter = actionDetailsUrlParameters.id;
const opParameter = actionDetailsUrlParameters.op;

export default function useNavigateToActionDetails() {
  const { location, navigate } = useNavigation();

  return (actionId?: string, copy?: boolean) => {
    location.pathname = actionDetailsFullyQualified;
    const op = copy ? 'copy' : null;
    setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, actionId);
    setOrDeleteMatrixKey(location, opParameter.path ?? '', opParameter.name, op);
    navigate(location);
  };
}
