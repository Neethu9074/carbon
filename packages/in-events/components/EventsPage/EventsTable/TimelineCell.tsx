/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { RawEvent } from '@instana/types';

import useTimeConfigUpdatingScale from 'in-events/components/useTimeConfigUpdatingScale';
import { EVENT_TYPES, getEventType } from 'in-stores/events';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './EventsTable.mless';

function toPercentageString(value: number) {
  return `${value}%`;
}

interface TimelineCellProps {
  event: RawEvent;
}

const TimelineCell: React.FC<TimelineCellProps> = ({ event }) => {
  const timeConfig = useTimeConfig();
  const timeScale = useTimeConfigUpdatingScale(timeConfig);

  const end = event.manualCloseTimestamp || event.end || Date.now();
  const start = event.start;
  const timeScaleStart = timeScale.getRange(start);
  const timeScaleEnd = timeScale.getRange(end);

  const left = toPercentageString(timeScaleStart);
  const eventType = getEventType(event);
  const isChangeEvent = eventType === EVENT_TYPES.CHANGE;
  const width = toPercentageString(isChangeEvent ? 10 : Math.max(12, timeScaleEnd - timeScaleStart));

  return (
    <div className={locals.timelineWrapper}>
      <div style={{ left, width }} className={locals.line} />
    </div>
  );
};

export default TimelineCell;
