/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { SloTrackerProvider, sloTrackers } from 'in-service-levels/hooks/SloTrackerProvider';
import FloatingAddSloButton from 'in-service-levels/components/FloatingAddSloButton';
import { serviceLevelsOverview } from 'in-service-levels/navigation/path';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import SloList from 'in-service-levels/components/SloList/SloList';
import DashboardHeader from 'in-components/DashboardHeader';
import Sticky from 'in-components/Sticky';

export default function ServiceLevelsOverview() {
  return (
    <Sticky
      header={
        <>
          <DashboardHeader
            icon="lib_service_level"
            label={t('in-components:mainNavigation.viewSwitcherLabelSlo')}
            title={t('in-components:mainNavigation.viewSwitcherLabelSlo')}
            labelForTitle={t('in-components:mainNavigation.viewSwitcherLabelSlo')}
            isBeta
          />
          <DashboardHeaderShadowModule />
        </>
      }
    >
      <LeftRightPadding>
        <SloTrackerProvider value={sloTrackers}>
          <SloList pathSegment={serviceLevelsOverview} />
        </SloTrackerProvider>
      </LeftRightPadding>
      <FloatingAddSloButton />
    </Sticky>
  );
}
