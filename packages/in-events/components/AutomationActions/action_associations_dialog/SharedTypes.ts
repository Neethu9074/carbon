/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

export interface MessageType {
  level?: 'warning' | 'error' | undefined;
  message: string;
}

export interface BluePrint {
  type: string;
  name: string;
  headline: string;
  description: { headline: string; htmlContent: string }[];
}
