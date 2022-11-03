/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { track, SELECT_ACTION_STEP_SWITCH, RUN_ACTION } from 'in-services/tracking/tracking';

export const selectActionsStepSwitch = (e: any) => track(SELECT_ACTION_STEP_SWITCH, e);
export const runAction = (e: any) => track(RUN_ACTION, e);
