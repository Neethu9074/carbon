/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { getStart } from 'in-applications/analyze/components/TraceDetails/components/callStartAndEndTime';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from './CallStartLabel.mless';

export default function CallStartLabel({ startTime, call, className }) {
  startTime = startTime || getStart(call);

  return (
    <span className={classNames(locals.callStartLabel, className)}>
      {t('in-analyze:traceDetails.callTimeAxis.started', { startedTime: formatDateTime(startTime) })}
    </span>
  );
}
