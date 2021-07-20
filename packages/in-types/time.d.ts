/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export interface TimeConfig {
  readonly windowSize: number;
  readonly to?: number | null;
  readonly focusedMoment?: number | null;
  readonly autoRefresh: boolean;
}
