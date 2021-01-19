/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TimestampCell.mless';

export default function TimestampCell({ time }) {
  return (
    <div className={locals.wrapper}>
      <SvgIcon type="lib_datetime_time" className={locals.icon} size="xs" />
      {formatDateTime(time)}
    </div>
  );
}
