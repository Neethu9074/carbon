/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { policiesDetailsFullyQualified } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Policy } from 'in-types';

export default function useLinkToPolicyDetails(policy: Policy) {
  const { createHref, location } = useNavigation();

  const path = location;
  path.pathname = policiesDetailsFullyQualified;
  setOrDeleteMatrixKey(path, '/policies', 'policyId', policy?.id);
  return createHref(path);
}
