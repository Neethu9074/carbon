/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import Sticky from 'in-components/Sticky';

export default function SloList() {
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
      <LeftRightPadding>{/* put your slo component here */}</LeftRightPadding>
    </Sticky>
  );
}
