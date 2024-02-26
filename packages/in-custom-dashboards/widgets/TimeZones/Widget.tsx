/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';
import rpt from 'prop-types';

import { getIntlDateFormatter } from '@instana/format-date';
import { Card, CardProps } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { serverTime$ } from 'in-stores/serverTime';

import locals from './Widget.mless';

interface PropsTimeZone {
  label: string;
  timeZone: string;
}

interface TimeZonesWidgetProps extends Pick<CardProps, 'title'> {
  actions: React.ReactNode;
  config?: Array<PropsTimeZone>;
  isPreview?: boolean;
  isInModal?: boolean;
  dragHandle: React.ReactNode;
}

export default function TimeZonesWidget({
  title,
  config: timeZones,
  actions,
  isPreview,
  isInModal,
  dragHandle
}: TimeZonesWidgetProps) {
  const serverTime = useObservable(getServerTime, []) ?? Date.now();

  return (
    <Card
      title={title}
      useMaxAvailableHeight={!isPreview}
      className={classNames({
        [locals.modal]: isInModal
      })}
      headerClassName={classNames({
        [locals.modal]: isInModal
      })}
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

interface TimeZoneProps extends PropsTimeZone {
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
