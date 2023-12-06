/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { policiesFullyQualified } from 'in-automation/navigation/paths';
import { defaultPolicyUrlParameters } from 'in-automation/navigation/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const policyIdParameter = defaultPolicyUrlParameters.policyId;

export default function useNavigateToPolicies() {
  const { location, navigate } = useNavigation();
  return () => {
    location.pathname = policiesFullyQualified;
    setOrDeleteMatrixKey(location, policyIdParameter.path ?? '', policyIdParameter.name, null);
    navigate(location);
  };
}
