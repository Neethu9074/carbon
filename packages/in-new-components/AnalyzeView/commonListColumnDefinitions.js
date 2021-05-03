/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export function createListTimestampColumnDefinition({
  label = t('in-new-components:analyze.earliestTimestamp'),
  getTimestamp
}) {
  return {
    label,
    width: '10rem',
    shrink: false,
    getContent(...args) {
      const timestamp = getTimestamp(...args);
      const earliestTimestamp = <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time>;
      return <KeyValue label={label} customValue={earliestTimestamp} accentuated />;
    }
  };
}
