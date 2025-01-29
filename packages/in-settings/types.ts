/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MessageTypes } from '@instana/components';

export interface ApiItemResult<RESULT> {
  result: Record<string, RESULT>;
}

export interface ApiItemMessage {
  message?: string;
  text?: string;
  type?: keyof typeof MessageTypes;
  isSaving?: boolean;
}
