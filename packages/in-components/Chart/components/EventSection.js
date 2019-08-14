import { interval } from 'reactive-observables';
import { pure } from 'recompose';
import React from 'react';

import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './EventSection.mless';

export default function EventSection({ event }) {
  if (!event) {
    return null;
  }

  return (
    <div className={locals.section}>
      <span className={locals.heading}>
        <time className={locals.time} dateTime={new Date(event.start).toISOString()}>
          {formatDateTime(event.start)}
        </time>
        <MinutesCount start={event.start} />
      </span>
      <div className={locals.content}>
        <SvgIcon className={locals.tooltipIcon} type="lib_release_rocket" />
        <span className={locals.releaseName}>Release: {event.name}</span>
      </div>
    </div>
  );
}

const MinutesCount = connectTo(({ start }) => ({
  rangeInMinutes: interval(1000)
    .startWith(start)
    .map(() => fromNowAccurately(start))
}))(
  pure(function MinutesCount({ rangeInMinutes }) {
    return <span className={locals.timeAgo}>&nbsp; ({rangeInMinutes} ago)</span>;
  })
);
