/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import CallTreeHeader from 'in-applications/analyze/AnalyzeView2_0/components/CallTreeHeader.tsx';

export default {
  parameters: {
    storyshots: { disable: true }
  },
  component: CallTreeHeader
};

export function DefaultRegular() {
  return <CallTreeHeader>{t('in-applications:traceDetail.components.callTreeHeaderParent')}</CallTreeHeader>;
}

export function Small() {
  return (
    <CallTreeHeader size="small">{t('in-applications:traceDetail.components.callTreeHeaderCalls')}</CallTreeHeader>
  );
}
