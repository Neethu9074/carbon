/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Observable } from '@instana/observables';
import { Result } from '@instana/types';

export type ExtractFunction<I> = (entity: I) => string;

export interface SelectEntitiesDialogProps<I> {
  extractId: ExtractFunction<I>;
  extractName: ExtractFunction<I>;
  observable?: () => Observable<Result<any[]>>;
  onSelected: (selectedIds: string[]) => void;
  preselectedIds: string[];
  title: string;
}

export interface SelectEntitiesRow<ROW_DATA> {
  id: string;
  name: string;
  rowData: ROW_DATA;
}
