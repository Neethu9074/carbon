/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { subtraceDashboard } from 'in-applications/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import { subtraceId } from 'in-applications/navigation/matrix';

export function useLinkToSubtraceDashboard() {
  const { location, createHref } = useNavigation();
  return ({ id }: Pick<Subtrace, 'id'>) => {
    location.pathname = subtraceDashboard;
    setOrDeleteMatrixKey(location, subtraceDashboard, subtraceId, id);
    return createHref(location);
  };
}
