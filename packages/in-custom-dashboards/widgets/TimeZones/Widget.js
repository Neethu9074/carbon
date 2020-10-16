import React, { useMemo } from 'react';
import rpt from 'prop-types';

import useObservable from 'in-hooks/useObservable';
import { serverTime$ } from 'in-stores/serverTime';
import Card from 'in-new-components/Card';

import locals from './Widget.mless';

export default function TimeZonesWidget({ title, config: timeZones, actions, isPreview, dragHandle }) {
  const serverTime = useObservable(getServerTime, []) ?? Date.now();

  return (
    <Card
      title={title}
      withoutPadding
      useMaxAvailableHeight={!isPreview}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
    >
      <dl className={locals.zones}>
        {timeZones.map(({ timeZone, label }, i) => (
          <TimeZone key={i} serverTime={serverTime} timeZone={timeZone} label={label} />
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

function TimeZone({ serverTime, label, timeZone }) {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat('de-de', {
        timeZone,
        hour12: false,
        hour: 'numeric',
        minute: 'numeric'
      }),
    [timeZone]
  );
  return (
    <div className={locals.zone}>
      <dt className={locals.label}>{label}</dt>
      <dd className={locals.time}>{formatter.format(new Date(serverTime))}</dd>
    </div>
  );
}

function getServerTime() {
  return serverTime$.nextFrame().throttle(10000);
}
