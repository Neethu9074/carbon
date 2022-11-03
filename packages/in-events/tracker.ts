/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { track, REMEDIATION_ASSOCIATE_ACTION, REMEDIATION_RUN_ACTION } from 'in-services/tracking/tracking';

export const actionsAssociatedToEvent = (e: any) => track(REMEDIATION_ASSOCIATE_ACTION, e);
export const runAction = (e: any) => track(REMEDIATION_RUN_ACTION, e);
