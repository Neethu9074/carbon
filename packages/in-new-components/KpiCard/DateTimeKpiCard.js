import React, { Fragment } from 'react';

import { formatDate, formatTime } from 'in-services/formatters/date';
import KpiCard from 'in-new-components/KpiCard';

import locals from './DateTimeKpiCard.mless';

export default function DateTimeKpiCard({ title, time }) {
  return (
    <KpiCard
      title={title}
      value={
        <Fragment>
          <span className={locals.row}>{formatDate(time)}</span>
          <span className={locals.row}>{formatTime(time)}</span>
        </Fragment>
      }
    />
  );
}
