/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';

import { CustomEventSpecificationWithMetadata, EventSpecificationInfo } from 'in-types';

export function getBuiltInEventSpecificationMutable(eventSpecificationId: string): Observable<EventSpecificationInfo>;
export function getCustomEventSpecificationMutable(
  eventSpecificationId: string
): Observable<CustomEventSpecificationWithMetadata>;
export function getEventSpecificationByIds(eventSpecificationIds: string[]): Observable<EventSpecificationInfo[]>;
export function getEventSpecifications(eventSpecificationIds?: string[]): Observable<EventSpecificationInfo[]>;
