/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { policyDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import { policiesDetailsFullyQualified } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const idParameter = policyDetailsUrlParameters.id;
const opParameter = policyDetailsUrlParameters.op;

export default function useHrefToPolicyDetails() {
  const { location, createHref } = useNavigation();

  return (policyId?: string, copy?: boolean) => {
    location.pathname = policiesDetailsFullyQualified;
    const op = copy ? 'copy' : null;
    setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, policyId);
    setOrDeleteMatrixKey(location, opParameter.path ?? '', opParameter.name, op);
    return createHref(location);
  };
}
