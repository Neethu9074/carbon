/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export type SortDirection = 'ASC' | 'DESC' | 'NONE';

export type SortState = {
  sortKey: string;
  direction: SortDirection;
};
