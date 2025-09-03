/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

const isLoading$ = create<boolean>().emit(false);

export function useGlobalLoadingIndicator(): [isLoading: boolean, setIsLoading: (loading: boolean) => void] {
  const isLoading = useObservable(isLoading$, [isLoading$]) ?? false;
  return [isLoading, loading => isLoading$.emit(loading)];
}
