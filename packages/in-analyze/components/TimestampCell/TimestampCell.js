/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { formatDateTime } from 'in-services/formatters/date';

import locals from './TimestampCell.mless';

export default function TimestampCell({ time }) {
  return (
    <div className={locals.wrapper}>
      <SvgIcon type="lib_datetime_time" className={locals.icon} size="xs" />
      {formatDateTime(time)}
    </div>
  );
}
