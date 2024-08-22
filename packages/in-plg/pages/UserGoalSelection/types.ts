/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

type GoalType = 'toggler';

export interface UserGoal {
  id: string;
  icon: string;
  text: string;
  type?: GoalType;
}

type ActiveLicenseType = 'selfService' | 'quota';

export interface UsageInfo {
  activeLicenseType?: ActiveLicenseType;
}
