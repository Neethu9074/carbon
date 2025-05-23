/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { policiesFullyQualified, policyDetailsFullyQualified } from 'in-automation/navigation/paths';
import { policyDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-events/navigation/paths';

const idParameter = policyDetailsUrlParameters.id;
const opParameter = policyDetailsUrlParameters.op;

export default function useHrefToPolicyDetails() {
  const { location, createHref } = useNavigation();
  const from = location.pathname;
  return (policyId?: string, copy?: boolean) => {
    location.pathname = policyDetailsFullyQualified;
    const op = copy ? 'copy' : null;
    setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, policyId);
    setOrDeleteMatrixKey(location, opParameter.path ?? '', opParameter.name, op);
    if (from !== policyDetailsFullyQualified) {
      if ([policiesFullyQualified, eventsPath].includes(from)) {
        location.query['from'] = from;
      } else {
        delete location.query.from;
      }
    }
    return createHref(location);
  };
}
