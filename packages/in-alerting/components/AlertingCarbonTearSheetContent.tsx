/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode, useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { triggerScrollToInvalidItem$ } from 'in-alerting/smart-alerts/components/tearSheet/hooks/useScrollToFirstInvalidItem';
import AlertTypography from 'in-alerting/components/AlertTypography';

import locals from './AlertingCarbonTearSheetContent.mless';

export default function AlertingCarbonTearSheetContent({ title, children }: { title?: string; children: ReactNode }) {
  const contentRef = React.useRef<any>(null);
  const triggerScrollToInvalidItem = useObservable(triggerScrollToInvalidItem$, []);

  useEffect(() => {
    if (!triggerScrollToInvalidItem) {
      contentRef.current.parentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [triggerScrollToInvalidItem]);

  return (
    <div id="contentSection" ref={contentRef} className={locals.contentWrapper}>
      {title && <AlertTypography variant={'heading-600'} content={title} noMargin />}
      <div className={locals.contentArea}>{children}</div>
    </div>
  );
}
