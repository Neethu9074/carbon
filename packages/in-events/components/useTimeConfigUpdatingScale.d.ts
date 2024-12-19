/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ScaleType } from 'in-services/scale';

interface TimeConfig {
  autoRefresh?: boolean;
  focusedMoment?: number | null;
  to?: number | null;
  windowSize: number;
}

export default function useTimeConfigUpdatingScale(timeConfig?: TimeConfig | null, width?: number): ScaleType;
