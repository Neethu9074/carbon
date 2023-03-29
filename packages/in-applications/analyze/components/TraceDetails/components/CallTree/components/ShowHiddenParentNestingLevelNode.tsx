/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import CallTreeHeader from 'in-applications/analyze/AnalyzeView2_0/components/CallTreeHeader';
import { t } from 'in-i18n';

interface ShowHiddenParentNestingLevelNodeProps {
  onShowHiddenParentNestingLevel: () => void;
}

export function ShowHiddenParentNestingLevelNode({
  onShowHiddenParentNestingLevel
}: ShowHiddenParentNestingLevelNodeProps) {
  return (
    <CallTreeHeader size="small" onClick={onShowHiddenParentNestingLevel}>
      {t('in-applications:traceDetail.components.callTreeHeaderParent')}
    </CallTreeHeader>
  );
}
