/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { formatDate, formatTime } from 'in-services/formatters/date';

import locals from './DateTimeSeparated.mless';

export default function DateTimeSeparated({ children }) {
  return (
    <div className={locals.wrapper}>
      <span className={locals.time}>{formatDate(children)}</span>
      <span>{formatTime(children)}</span>
    </div>
  );
}
