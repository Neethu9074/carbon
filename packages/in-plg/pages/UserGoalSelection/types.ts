/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export interface Goal {
  id: string;
  icon: string;
  text: string;
  type?: 'toggler' | string;
}

export interface AccountActivation {
  [key: string]: {
    fs: {
      status: boolean;
    };
  };
}

export interface UsageInfo {
  activeLicenseType?: 'selfService' | 'quota';
}
