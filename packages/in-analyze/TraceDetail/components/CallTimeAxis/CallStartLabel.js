/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { getStart } from 'in-analyze/TraceDetail/components/callStartAndEndTime';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from './CallStartLabel.mless';

export default getElementDimensions(({ startTime, call, className }) => {
  startTime = startTime || getStart(call);

  return (
    <span className={classNames(locals.callStartLabel, className)}>
      <SvgIcon className={locals.icon} type="lib_datetime_time" />
      {t('in-analyze:traceDetails.callTimeAxis.started', { startedTime: formatDateTime(startTime) })}
    </span>
  );
});
