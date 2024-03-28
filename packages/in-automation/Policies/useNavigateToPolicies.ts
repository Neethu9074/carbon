/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { policyDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { policiesFullyQualified } from 'in-automation/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const idParameter = policyDetailsUrlParameters.id;

export default function useNavigateToPolicies() {
  const { location, navigate } = useNavigation();
  return () => {
    location.pathname = policiesFullyQualified;
    setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, null);
    navigate(location);
  };
}
