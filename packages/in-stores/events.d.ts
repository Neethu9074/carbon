/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ButtonKinds } from '@instana/components';

import { EventMap } from 'in-events/types';
import { Event, RawEvent } from 'in-types';

export const EVENT_TYPES;

export const openEventsAtServerTime$: Observable<any>;

export const healthColors: Record<string, string>;

type Kind = keyof typeof ButtonKinds;

export function getDesignLibraryColorBySeverity(severity: number, fallback?: string): string;
export function getDesignLibrarySeverityIcon(severity: number): string;

export function getButtonKindBySeverity(severity: number, fallback?: Kind): Kind;

interface Parms {
  defaultColor?: string;
}

export function getColorBySeverity(severity: number, parms?: Parms): Property.BackgroundColor | undefined;
export function getColorForEventAtFocusedMomentAsStream(event: Event, params: Params): string;
export function getIcon(eventType: number): string;
export function getEventType(event: RawEvent | EventMap): number;
export function getEventSeverityLabelWithEventType(event: RawEvent | EventMap, timeConfig: TimeConfig): string;
