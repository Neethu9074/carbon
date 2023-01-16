/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ButtonKinds } from '@instana/components';

type Kind = keyof typeof ButtonKinds;

export function getDesignLibraryColorBySeverity(severity: number, fallback?: string): string;

export function getButtonKindBySeverity(severity: number, fallback?: Kind): Kind;
