/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t } from 'in-i18n';

import locals from './StackTracePresentation.mless';

export default function StackTraceWrapper({ children }) {
  return (
    <div className={locals.stackTrace}>
      <p className={locals.title}>{t('in-analyze:traceDetail.components.callDetails.stackTrace')}</p>
      {children}
    </div>
  );
}
