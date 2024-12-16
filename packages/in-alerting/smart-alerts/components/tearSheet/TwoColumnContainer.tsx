/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';

import locals from 'in-alerting/smart-alerts/components/tearSheet/TwoColumnContainer.mless';

interface TwoColumnContainerProps {
  mainContent: ReactNode;
  secondaryContent: ReactNode;
}

export default function TwoColumnContainer({ mainContent, secondaryContent }: TwoColumnContainerProps) {
  return (
    <div className={locals.alertProsWrapper}>
      <div className={locals.alertProsForm}>{mainContent}</div>
      <div className={locals.alertProsPreview}>{secondaryContent}</div>
    </div>
  );
}
