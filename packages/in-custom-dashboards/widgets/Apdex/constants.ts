/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { apdexWidgetEnabled, sloEnabled } from 'in-services/featureFlags';

export const isApdexWidgetEnabled = sloEnabled && apdexWidgetEnabled;
