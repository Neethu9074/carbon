/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { create } from '@instana/observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import { getAction } from 'in-automation/api';

const refreshSignal = create().emit(true);
export function refreshAction() {
  refreshSignal.emit(true);
}

const useAction = memoize(getActionAsResultObservableInternal, id => id, 3000);

function getActionAsResultObservableInternal(id: string) {
  return refreshSignal.flatMap(() => getAction(id));
}

export default useAction;
