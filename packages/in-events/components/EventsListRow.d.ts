/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { RawEvent } from '@instana/types';
declare module 'in-events/components/EventsListRow' {
  import React from 'react';

  interface OnEntityProps {
    rawEvent: RawEvent;
    label?: string;
    smallColumn?: boolean;
  }

  const OnEntity: React.FC<OnEntityProps>;
  export { OnEntity };

  export function getStateBadge(event: RawEvent): React.ReactElement;

  export function getColorForState(event: RawEvent): string;

  export function getEndValue(
    event: RawEvent,
    isChangeEvent: boolean,
    end: number,
    start: number,
    headers: any[],
    isPreview: boolean
  ): DateFormatterOutput;
}
