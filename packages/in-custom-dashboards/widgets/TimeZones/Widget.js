import { compose, setPropTypes, withPropsOnChange } from 'recompose';
import rpt from 'prop-types';
import React from 'react';

import { serverTime$ } from 'in-stores/serverTime';
import Card from 'in-new-components/Card';
import connecTo from 'in-hoc/connectTo';

import locals from './Widget.mless';

const timeZoneShape = rpt.shape({
  timeZone: rpt.string.isRequired,
  label: rpt.string.isRequired
});

export default compose(
  setPropTypes({
    title: rpt.string.isRequired,
    config: rpt.arrayOf(timeZoneShape).isRequired
  }),
  connecTo({
    serverTime: serverTime$.nextFrame().throttle(10000)
  })
)(TimeZonesWidget);

function TimeZonesWidget({ title, config: timeZones, serverTime, actions }) {
  serverTime = serverTime || Date.now();

  return (
    <Card title={title} withoutPadding useMaxAvailableHeight header={actions}>
      <dl className={locals.zones}>
        {timeZones.map(({ timeZone, label }, i) => (
          <TimeZone key={i} serverTime={serverTime} timeZone={timeZone} label={label} />
        ))}
      </dl>
    </Card>
  );
}

const TimeZone = compose(
  withPropsOnChange(['timeZone'], ({ timeZone }) => ({
    formatter: new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    })
  }))
)(function TimeZone({ formatter, serverTime, label }) {
  return (
    <div className={locals.zone}>
      <dt className={locals.label}>{label}</dt>
      <dd className={locals.time}>{formatter.format(new Date(serverTime))}</dd>
    </div>
  );
});
