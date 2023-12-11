/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { defaultPolicyUrlParameters, detailsPolicyUrlParameters } from 'in-automation/navigation/urlParameters';
import { policiesDetailsFullyQualified } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Policy } from 'in-types';

const policyIdParameter = defaultPolicyUrlParameters.policyId;
const opParameter = detailsPolicyUrlParameters.op;

export default function useNavigateToPolicyDetails() {
  const { location, navigate } = useNavigation();

  return (policy?: Policy, copy?: boolean) => {
    location.pathname = policiesDetailsFullyQualified;
    const op = copy ? 'copy' : null;
    setOrDeleteMatrixKey(location, policyIdParameter.path ?? '', policyIdParameter.name, policy?.id);
    setOrDeleteMatrixKey(location, opParameter.path ?? '', opParameter.name, op);
    navigate(location);
  };
}
