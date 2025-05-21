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
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/slo/CreateSmartAlertDialog';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import FloatingSloButtons from 'in-service-levels/components/FloatingSloButtons';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import SloList from 'in-service-levels/components/SloList/SloList';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import Alerts from 'in-alerting/smart-alerts/slo/Alerts';
import Footer from 'in-components/Footer/Footer';
import Sticky from 'in-components/Sticky/Sticky';
import { t } from 'in-i18n';

export default function ServiceLevelsOverview() {
  const { createHrefToPath, matchLocation } = useNavigation();
  const isServiceLevelsAlertsActive = matchLocation(serviceLevelsAlertsFullyQualified);
  const isSloSmartAlertDetails = matchLocation(serviceLevelsAlertDetailsFullyQualified);

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
      {!isServiceLevelsAlertsActive && <FloatingSloButtons />}
      {((isServiceLevelsAlertsActive && !smartAlertCarbonTableEnabled) || isSloSmartAlertDetails) && (
        <FloatingActionButtons>
          <FloatingActionButton
            icon="lib_alerts_create"
            kind="primaryv2"
            onClick={() => addActiveDialog(<CreateSmartAlertDialog />)}
          >
            {t('in-service-levels:general.addButtonLabel', { context: 'smartAlert' })}
          </FloatingActionButton>
        </FloatingActionButtons>
      )}
    </Sticky>
  );
}

function SloSmartAlerts() {
  const { matchLocation } = useNavigation();

  if (matchLocation(serviceLevelsAlertDetailsFullyQualified)) return <SloSmartAlertDetails />;

  return <Alerts />;
}
