/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { formatDate, formatTime } from 'in-services/formatters/date';
import KpiCard from 'in-components/KpiCard';

import locals from './DateTimeKpiCard.mless';

export default function DateTimeKpiCard({ title, time, borderless }) {
  return (
    <KpiCard
      title={title}
      value={time}
      renderValue={value => (
        <time dateTime={new Date(value).toISOString()}>
          <span className={locals.row}>{formatDate(value)}</span>
          <span className={locals.row}>{formatTime(value)}</span>
        </time>
      )}
      borderless={borderless}
      raw
    />
  );
}
