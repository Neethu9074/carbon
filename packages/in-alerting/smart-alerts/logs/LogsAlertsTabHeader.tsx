/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';

import ViewSwitcher from 'in-logging/analyze/AnalyzeView/ViewSwitcher';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function LogsAlertsTabHeader({ children }: { children: ReactNode }) {
  return (
    <Sticky
      header={
        <>
          <AnalyzeHeader
            isGrouped={false}
            liveModeDisabled
            liveModeDisabledTooltip={t('in-logging:liveModeDisabled')}
            withoutShadow
          />
          <ViewSwitcher />
        </>
      }
    >
      {children}
    </Sticky>
  );
}
