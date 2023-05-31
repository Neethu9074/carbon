/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Map } from 'immutable';

import { Observable } from '@instana/observables';

import { Action, CustomEventSpecification, EventSpecificationInfo } from 'in-types';

export function getCustomEventActions(eventSpecificationId: string): Observable<Action[]>;
export function getCustomEventSpecificationWithActions(eventSpecificationId: string): Observable<Map<string, unknown>>;
export function getCustomEventSpecificationMutable(
  eventSpecificationId: string
): Observable<CustomEventSpecificationWithMetadata>;
export function getBuiltinEventActions(eventSpecificationId: string): Observable<Action[]>;
export function saveCustomEventSpecificationWithActions(
  eventSpecification: CustomEventSpecification
): Observable<CustomEventSpecification>;
export function updateActionsAssignedToBuiltInEvent(
  actions: { id: string }[],
  eventSpecificationId: string | undefined
): Observable<Action[]>;
export function getBuiltInEventSpecificationMutable(eventSpecificationId: string): Observable<EventSpecificationInfo>;
export function getCustomEventSpecificationMutable(eventSpecificationId: string): Observable<CustomEventSpecification>;
export function getEventSpecificationByIds(eventSpecificationIds: string[]): Observable<EventSpecificationInfo[]>;
export function getEventSpecifications(eventSpecificationIds?: string[]): Observable<EventSpecificationInfo[]>;
