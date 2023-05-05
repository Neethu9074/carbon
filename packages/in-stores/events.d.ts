/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ButtonKinds } from '@instana/components';

import { RawEvent } from 'in-types';

type Kind = keyof typeof ButtonKinds;

export function getDesignLibraryColorBySeverity(severity: number, fallback?: string): string;

export function getButtonKindBySeverity(severity: number, fallback?: Kind): Kind;

interface Parms {
  defaultColor?: string;
}
export function getColorBySeverity(severity: number, parms?: Parms): Property.BackgroundColor | undefined;
export function getIcon(eventType: number): string;
export function getEventType(event: RawEvent): number;
