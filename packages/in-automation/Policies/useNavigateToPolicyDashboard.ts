/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { defaultPolicyUrlParameters } from 'in-automation/navigation/urlParameters';
import { policiesOverviewFullyQualified } from 'in-automation/navigation/paths';
import { Policy } from 'in-types';

const policyIdParameter = defaultPolicyUrlParameters.policyId;

export default function useNavigateToPolicyDashboard() {
  const { location, navigate } = useNavigation();

  return (slo: Policy) => {
    location.pathname = policiesOverviewFullyQualified;
    setOrDeleteMatrixKey(location, policyIdParameter.path ?? '', policyIdParameter.name, slo.id!);
    navigate(location);
  };
}
