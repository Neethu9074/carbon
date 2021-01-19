/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { formatDateTime } from 'in-services/formatters/date';

import locals from './TimeOfLastUpdateCardTitle.mless';

export default function TimeOfLastUpdateCardTitle({ title, timestamp }) {
  if (!timestamp) {
    return title;
  }

  return (
    <Fragment>
      {title} <span className={locals.element}>(as of {formatDateTime(timestamp)})</span>
    </Fragment>
  );
}
