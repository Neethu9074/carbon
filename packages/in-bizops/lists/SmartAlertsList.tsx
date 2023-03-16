/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import ViewSwitcher from 'in-bizops/components/ViewSwitcher';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export default function SmartAlertsList() {
  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <Title title={t('in-bizops:labelSmartAlerts')} />
        <ViewTrackingMeta
          data={{
            productArea: 'BizOps',
            pageRootName: 'BizOps'
          }}
        />
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}
