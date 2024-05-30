/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { actionDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import { actionDetailsFullyQualified } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Action } from 'in-types';

const idParameter = actionDetailsUrlParameters.id;
const opParameter = actionDetailsUrlParameters.op;
const viewParameter = actionDetailsUrlParameters.view;

export default function useNavigateToActionDetails() {
  const { location, navigate } = useNavigation();

  return (action?: Action, copy?: boolean, viewType?: string) => {
    location.pathname = actionDetailsFullyQualified;
    const op = copy ? 'copy' : null;
    const tabType = viewType ?? null;
    setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, action?.id);
    setOrDeleteMatrixKey(location, opParameter.path ?? '', opParameter.name, op);
    setOrDeleteMatrixKey(location, viewParameter.path ?? '', viewParameter.name, tabType);
    navigate(location);
  };
}
