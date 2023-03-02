/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Error, LogItem, Progress } from '@instana/types';

export interface LogsCursorPaginationState {
  items: LogItem[];
  progress: Progress;
  errors: Error[];
  awaitingData: boolean;
  canLoadMore: boolean;
  initialLogLines: number;
  currentRetrievalSize: number;
  afterKey?: string;
  nextAfterKey?: string;
  time?: number;
}

export interface CreateParams {
  afterKey?: string;
  initialLogLines: number;
  retrievalSize: number;
}
