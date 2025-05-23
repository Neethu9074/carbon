/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { create } from '@instana/observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import { pendingResult } from 'in-services/fixedObjects';
import { getPolicy } from 'in-automation/api';
import { Policy, Result } from 'in-types';

const refreshSignal = create().emit(true);
export function refreshPolicy() {
  refreshSignal.emit(true);
}

const usePolicy = memoize(getActionAsResultObservableInternal, id => id, 60000);

function getActionAsResultObservableInternal(id: string) {
  return refreshSignal.flatMap(() => getPolicy(id) ?? (pendingResult as Result<Policy>));
}

export default usePolicy;
