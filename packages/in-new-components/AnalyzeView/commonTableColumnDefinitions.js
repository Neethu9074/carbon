/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export function createTableTimestampColumnDefinition({
  label = t('in-new-components:analyze.timestamp'),
  getTimestamp
}) {
  return {
    label,
    width: '11rem',
    widthInAbsoluteUnit: true,
    defaultOrderDirection: 'DESC',
    getContent(...args) {
      const timestamp = getTimestamp(...args);
      return <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time>;
    }
  };
}
