import React from 'react';

import { formatDate, formatTime } from 'in-services/formatters/date';
import KpiCard from 'in-new-components/KpiCard';

import locals from './DateTimeKpiCard.mless';

export default function DateTimeKpiCard({ title, time, borderless }) {
  return (
    <KpiCard
      title={title}
      value={
        <time dateTime={new Date(time).toISOString()}>
          <span className={locals.row}>{formatDate(time)}</span>
          <span className={locals.row}>{formatTime(time)}</span>
        </time>
      }
      borderless={borderless}
      raw
    />
  );
}
