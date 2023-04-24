/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import FloatingAddSloButton from 'in-service-levels/components/FloatingAddSloButton';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { serviceLevelsDashboard } from 'in-service-levels/navigation/path';
import SloList from 'in-service-levels/components/SloList/SloList';
import Sticky from 'in-components/Sticky';

export default function ServiceLevelsDashboard() {
  return (
    <Sticky
      header={
        <>
          <DashboardHeader
            icon="lib_service_level"
            label={t('in-components:mainNavigation.viewSwitcherLabelSlo')}
            title={t('in-components:mainNavigation.viewSwitcherLabelSlo')}
            labelForTitle={t('in-components:mainNavigation.viewSwitcherLabelSlo')}
          />
          <DashboardHeaderShadowModule />
        </>
      }
    >
      <LeftRightPadding>
        <SloList pathSegment={serviceLevelsDashboard} />
      </LeftRightPadding>
      <FloatingAddSloButton />
    </Sticky>
  );
}
