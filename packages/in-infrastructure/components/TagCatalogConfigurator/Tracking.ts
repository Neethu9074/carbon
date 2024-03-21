/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export interface Tracking {
  readonly onTagAdded?: (tag: string) => void;
  readonly onTagRemoved?: (tag: string) => void;
}
