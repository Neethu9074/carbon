/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Action } from 'in-types';

export function getCustomEventActions(eventSpecificationId: string): Observable<Action[]>;
export function getBuiltinEventActions(eventSpecificationId: string): Observable<Action[]>;
