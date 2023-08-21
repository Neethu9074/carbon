/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

//@ts-expect-error
import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
//@ts-expect-error
import useOldBackgroundColor from 'in-infrastructure/hooks/useOldBackgroundColor';
import Alerts from 'in-alerting/smart-alerts/infrastructure/Alerts';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export default function SmartAlertView() {
  useOldBackgroundColor();
  return (
    <InfraPageHeaderWithTabs>
      <ViewTrackingMeta
        data={{
          productArea: 'Infrastructure',
          pageRootName: 'Infra Smart Alerts'
        }}
      />

      <Title title={t('in-infrastructure:smartAlertView.smartAlertTab')} />
      <Alerts />
    </InfraPageHeaderWithTabs>
  );
}
