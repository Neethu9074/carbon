/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { create } from '@instana/observables';
import { SavedFilter } from '@instana/types';

export const selectedFilter$ = create<{ action: string; filter: Partial<SavedFilter> | null }>();
selectedFilter$.emit({ action: '', filter: null });
export const setSelectedFilter = (action: string, filter: Partial<SavedFilter>) => {
  selectedFilter$.emit({
    action: action,
    filter: filter
  });
};

export const clearSelectedFilter = () => {
  selectedFilter$.emit({ action: '', filter: null });
};
