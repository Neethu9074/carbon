/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Action, CustomEventSpecification } from 'in-types';

export function getCustomEventActions(eventSpecificationId: string): Observable<Action[]>;
export function getCustomEventSpecificationWithActions(
  eventSpecificationId: string
): Observable<CustomEventSpecification>;
export function getBuiltinEventActions(eventSpecificationId: string): Observable<Action[]>;
export function saveCustomEventSpecificationWithActions(
  eventSpecification: CustomEventSpecification
): Observable<CustomEventSpecification>;
export function updateActionsAssignedToBuiltInEvent(
  actions: { id: string }[],
  eventSpecificationId: string | undefined
): Observable<Action[]>;
export function getBuiltInEventSpecification(eventSpecificationId: string): Observable<CustomEventSpecification>;
