/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/* Legacy component SeverityIndicatorCellContentWrapper is moved from ui-foundation to
 * ui-client during carbon migration. The component name is maintained to
 * minimise the code changes involved with this change.
 * To be removed when there are no more legacy tables in the code.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import locals from './LegacySeverityIndicatorCellContentWrapper.mless';

export type SeverityIndicatorCellContentWrapperProps = {
  severity?: number;
  children?: ReactNode;
};

// Status used for Carbon adoption when trying to create the similar status border
function getSeverityClass(severity: number) {
  if (severity > 5) {
    return locals.dataTableErrorBorder;
  } else if (severity > 0) {
    return locals.dataTableWarningBorder;
  }
  return locals.dataTableGreenBorder;
}

export function SeverityIndicatorCellContentWrapper({ severity, children }: SeverityIndicatorCellContentWrapperProps) {
  if (severity == null || severity < 0) {
    return <>{children}</>;
  }

  const severityClass = getSeverityClass(severity);
  return <div className={classNames(severityClass, locals.wrapper)}>{children}</div>;
}
