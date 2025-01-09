/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

declare module 'in-events/components/EventsListRow' {
  import React from 'react';
  import { RawEvent } from 'in-types';

  interface OnEntityProps {
    rawEvent: RawEvent;
    label?: string;
    smallColumn?: boolean;
  }

  const OnEntity: React.FC<OnEntityProps>;
  export { OnEntity };

  export function getStateBadge(event: RawEvent): React.ReactElement;
  export function getEndValue(
    event: RawEvent,
    isChangeEvent: boolean,
    end: number,
    start: number,
    headers: any[],
    isPreview: boolean
  ): DateFormatterOutput;
}
