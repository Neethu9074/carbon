/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import SubViewHeader from 'in-settings/components/SubViewHeader';

import locals from 'in-alerting/smart-alerts/components/pageHeaderTemplate/AlertingPageHeader.mless';

export default function AlertingPageHeader({ title }: { title: string }) {
  return (
    <div className={locals.actionBody}>
      <>
        <HorizontalFlexWrapper className={locals.spaceBetween}>
          <SubViewHeader iconType="lib_alerts_create">
            <div>{title}</div>
          </SubViewHeader>
        </HorizontalFlexWrapper>
        <DashboardHeaderShadowModule />
      </>
    </div>
  );
}
