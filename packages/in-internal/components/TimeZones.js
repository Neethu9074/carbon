/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import { serverTime$ } from 'in-stores/serverTime';
import connecTo from 'in-hoc/connectTo';

import locals from './TimeZones.mless';

export default function TimeZones() {
  return (
    <dl className={locals.zones}>
      <TimeZone timeZone="America/Los_Angeles" label="San Francisco" />
      <TimeZone timeZone="America/Chicago" label="Austin" />
      <TimeZone timeZone="America/New_York" label="New York City" />
      <TimeZone timeZone="UTC" label="UTC" />
      <TimeZone timeZone="Europe/Berlin" label="Solingen" />
      <TimeZone timeZone="Europe/Belgrade" label="Novi Sad" />
      <TimeZone timeZone="Asia/Tokyo" label="Tokyo" />
      <TimeZone timeZone="Australia/Sydney" label="Sydney" />
    </dl>
  );
}

const TimeZone = connecTo(
  props => {
    const formatter = new Intl.DateTimeFormat('de-de', {
      timeZone: props.timeZone,
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    });
    return {
      time: serverTime$.map(t => formatter.format(new Date(t))).distinct()
    };
  },
  function TimeZone({ time, label }) {
    return (
      <div
        className={classNames({
          [locals.zone]: true,
          [locals.sleepy]: isSleepy(time)
        })}
      >
        <dt className={locals.label}>{label}</dt>
        <dd className={locals.time}>{time}</dd>
      </div>
    );
  }
);

function isSleepy(timeStr) {
  const hour = Number(timeStr.split(':')[0]);
  return hour < 9 || hour > 17;
}
