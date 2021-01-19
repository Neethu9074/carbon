/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './LogTooltipContent.mless';

export default function LogTooltipContent({ log }) {
  return (
    <div className={locals.content}>
      <div className={log.errorCount > 0 ? locals.severityLabelFailure : locals.severityLabelWarning}>
        {log.errorCount > 0 ? 'Error Log' : 'Warning Log'}
      </div>
      <span className={locals.headingLabel}>{log.label}</span>
    </div>
  );
}
