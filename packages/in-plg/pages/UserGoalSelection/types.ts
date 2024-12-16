/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { UserSettings } from 'in-services/userSettings/globals';

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

export interface ExtendedUserSettings extends UserSettings {
  showUserGoalSelection?: boolean;
}

export interface SegmentTracking {
  trackCta: CtaTrackingFunction;
  unstable_trackEvent: Function;
}
