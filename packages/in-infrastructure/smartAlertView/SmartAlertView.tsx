/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { CreateInfraSmartAlertFloatingButtons } from 'in-infrastructure/smartAlertView/CreateInfraSmartAlertFloatingButtons';
//@ts-expect-error
import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import { carbonTableEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import Alerts from 'in-alerting/smart-alerts/infrastructure/Alerts';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export default function SmartAlertView() {
  return (
    <>
      <InfraPageHeaderWithTabs>
        <ViewTrackingMeta
          data={{
            productArea: productAreas.infrastructure,
            pageRootName: pageNames.infra_smart_alerts
          }}
        />

        <Title title={t('in-infrastructure:smartAlertView.smartAlertTab')} />
        <Alerts />
      </InfraPageHeaderWithTabs>
      {!carbonTableEnabled || (!smartAlertCarbonTableEnabled && <CreateInfraSmartAlertFloatingButtons />)}
    </>
  );
}
