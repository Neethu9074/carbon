/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem } from '@instana/components';

import { formatDateTime, fromNow } from 'in-services/formatters/date';

export function DateTimeWithPeriodSinceDescriptionItem({ dateTime, title }) {
  if (!dateTime) {
    return null;
  }

  return (
    <DescriptionItem title={title}>
      {formatDateTime(dateTime)} ({fromNow(dateTime)})
    </DescriptionItem>
  );
}
