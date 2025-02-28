/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';

import {
  serviceLevelsOverview,
  serviceLevelsAlertsFullyQualified,
  serviceLevelsAlertDetailsFullyQualified
} from 'in-service-levels/navigation/path';
import SloSmartAlertDetails from 'in-service-levels/components/SloDashboard/components/SloSmartAlertDetails';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import FloatingSloButtons from 'in-service-levels/components/FloatingSloButtons';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import SloList from 'in-service-levels/components/SloList/SloList';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import Alerts from 'in-alerting/smart-alerts/slo/Alerts';
import Footer from 'in-components/Footer/Footer';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function ServiceLevelsOverview() {
  const { createHrefToPath, matchLocation } = useNavigation();
  const isServiceLevelsAlertsActive = matchLocation(serviceLevelsAlertsFullyQualified);
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
          <DashboardHeaderModule>
            <SecondLevelNavigation>
              <SecondLevelNavigationItem
                href={createHrefToPath(serviceLevelsOverview)}
                label={t('in-service-levels:sloList.title')}
                isActive={!isServiceLevelsAlertsActive}
              />

              <SecondLevelNavigationItem
                href={createHrefToPath(serviceLevelsAlertsFullyQualified)}
                label={t('in-service-levels:sloDashboard.tabs.smartAlertsLabel')}
                isActive={isServiceLevelsAlertsActive}
              />
            </SecondLevelNavigation>
          </DashboardHeaderModule>
          <DashboardHeaderShadowModule />
        </>
      }
    >
      <LeftRightPadding>
        <ViewTrackingMeta data={{ productArea: productAreas.slo, pageRootName: pageNames.service_levels }} />
        {!isServiceLevelsAlertsActive && <SloList pathSegment={serviceLevelsOverview} />}
        {isServiceLevelsAlertsActive && <SloSmartAlerts />}
      </LeftRightPadding>
      <Footer />
      <FloatingSloButtons />
    </Sticky>
  );
}

function SloSmartAlerts() {
  const { matchLocation } = useNavigation();

  if (matchLocation(serviceLevelsAlertDetailsFullyQualified)) return <SloSmartAlertDetails />;

  return <Alerts />;
}
