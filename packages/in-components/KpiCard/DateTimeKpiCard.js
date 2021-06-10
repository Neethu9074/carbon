/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { formatDate, formatTime } from 'in-services/formatters/date';
import KpiCard from 'in-components/KpiCard';

import locals from './DateTimeKpiCard.mless';

export default function DateTimeKpiCard({ title, time, borderless }) {
  return (
    <KpiCard
      title={title}
      value={
        time ? (
          <time dateTime={new Date(time).toISOString()}>
            <span className={locals.row}>{formatDate(time)}</span>
            <span className={locals.row}>{formatTime(time)}</span>
          </time>
        ) : (
          valueMissingPlaceholder
        )
      }
      borderless={borderless}
      raw
    />
  );
}
