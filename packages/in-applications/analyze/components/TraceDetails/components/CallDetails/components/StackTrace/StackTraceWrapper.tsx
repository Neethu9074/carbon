/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { t } from 'in-i18n';

import locals from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/StackTracePresentation.mless';

export default function StackTraceWrapper({ children }: { children: ReactNode }) {
  return (
    <div className={locals.stackTrace}>
      <p className={locals.title}>{t('in-analyze:traceDetail.components.callDetails.stackTrace')}</p>
      {children}
    </div>
  );
}
