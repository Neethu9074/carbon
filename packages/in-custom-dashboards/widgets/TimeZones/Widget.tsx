/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import rpt from 'prop-types';

import { getIntlDateFormatter } from '@instana/format-date';
import { useObservable } from '@instana/hooks';
import { Card, CardProps } from '@instana/components';

import { serverTime$ } from 'in-stores/serverTime';

import locals from './Widget.mless';

interface TimeZone {
  label: string;
  timeZone: string;
}

interface TimeZonesWidgetProps extends Pick<CardProps, 'title'> {
  actions: React.ReactNode;
  config?: Array<TimeZone>;
  isPreview?: boolean;
  dragHandle: React.ReactNode;
}

export default function TimeZonesWidget({
  title,
  config: timeZones,
  actions,
  isPreview,
  dragHandle
}: TimeZonesWidgetProps) {
  const serverTime = useObservable(getServerTime, []) ?? Date.now();

  return (
    <Card
      title={title}
      useMaxAvailableHeight={!isPreview}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
      isScrollable
    >
      <dl className={locals.zones}>
        {timeZones?.map(({ timeZone, label }, i) => (
          <TimeZone key={i} serverTime={serverTime} timeZone={timeZone} label={label || timeZone} />
        ))}
      </dl>
    </Card>
  );
}

TimeZonesWidget.protpTypes = {
  title: rpt.string.isRequired,
  config: rpt.arrayOf(
    rpt.shape({
      timeZone: rpt.string.isRequired,
      label: rpt.string.isRequired
    })
  ).isRequired
};

interface TimeZoneProps extends TimeZone {
  serverTime: number;
}

function TimeZone({ serverTime, label, timeZone }: TimeZoneProps) {
  const formatter = useMemo(
    () =>
      getIntlDateFormatter({
        timeZone,
        timeStyle: 'short'
      }),
    [timeZone]
  );
  return (
    <div className={locals.zone}>
      <dt className={locals.label}>{label}</dt>
      <dd className={locals.time}>{formatter(serverTime)}</dd>
    </div>
  );
}

function getServerTime() {
  return serverTime$.nextFrame().throttle(10000);
}
