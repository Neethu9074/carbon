/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect } from 'react';

import { generateStableHash } from '@instana/utils';

import {
  anyPlatformAccessPermissions,
  applicationsAccessPermissions,
  bizopsAccessPermissions,
  eventsAccessPermissions,
  infrastructureAccessPermissions,
  mobileAppsAccessPermissions,
  sloAccessPermissions,
  syntheticsAccessPermissions,
  websitesAccessPermissions
} from 'in-stores/permission';
import { businessObservabilityEnabled, sloFullEnabled, syntheticsEnabled } from 'in-services/featureFlags';
import DashboardWidget from 'in-plg/pages/WelcomePage/widgets/DashboardWidget';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { refreshCustomDashboards } from 'in-custom-dashboards/api';
import { getWidget } from 'in-plg/pages/WelcomePage/PageContent';
import { productAreas } from 'in-services/tracking/productAreas';
import { PERMISSION_STRATEGY } from 'in-stores/useHasPermission';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { pageNames } from 'in-services/tracking/pageNames';
import useHasAccesses from 'in-stores/useHasAccesses';
import useHasAccess from 'in-stores/useHasAccess';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/pages/CustomDashboards.mless';

export default function CustomDashboards() {
  const [role] = useCurrentUserRole();
  const hasApplicationsAccess = useHasAccess({ requiredPermissions: applicationsAccessPermissions });
  const hasBizOpsAccess = useHasAccess({
    optionalPrecondition: businessObservabilityEnabled,
    requiredPermissions: bizopsAccessPermissions
  });
  const hasInfrastructureAccess = useHasAccess({ requiredPermissions: infrastructureAccessPermissions });
  const hasMobileAppsAccess = useHasAccess({ requiredPermissions: mobileAppsAccessPermissions });
  const hasSyntheticsAccess = useHasAccess({
    optionalPrecondition: syntheticsEnabled,
    requiredPermissions: syntheticsAccessPermissions
  });
  const hasWebsitesAccess = useHasAccess({ requiredPermissions: websitesAccessPermissions });
  const hasAnyPlatformAccess = useHasAccesses({
    requiredPermissions: anyPlatformAccessPermissions,
    strategy: PERMISSION_STRATEGY.REQUIRE_ANY
  });
  const hasEventsAccess = useHasAccesses({
    requiredPermissions: eventsAccessPermissions,
    strategy: PERMISSION_STRATEGY.REQUIRE_ANY
  });
  const hasSloAccess = useHasAccesses({
    optionalPrecondition: sloFullEnabled,
    requiredPermissions: sloAccessPermissions,
    strategy: PERMISSION_STRATEGY.REQUIRE_ANY
  });

  useEffect(() => {
    refreshCustomDashboards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash(role)]);

  const widgetProps = getWidget('dashboardWidget', {
    hasAnyPlatformAccess,
    hasApplicationsAccess,
    hasBizOpsAccess,
    hasEventsAccess,
    hasInfrastructureAccess,
    hasMobileAppsAccess,
    hasSloAccess,
    hasSyntheticsAccess,
    hasWebsitesAccess
  });
  const dashboardTileProps = {
    ...widgetProps,
    header: '',
    icon: '',
    key: ''
  };

  // Scroll to the top in case the user comes from the widget in the main page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.custom_dashboard,
          pageName: pageNames.custom_dashboard,
          pageRootName: pageNames.custom_dashboard
        }}
      />
      <div className={locals.container}>
        <DashboardHeader
          icon="lib_custom_dashboard"
          title={t('in-custom-dashboards:customDashboard.customDashboardsTitle')}
          label={t('in-custom-dashboards:customDashboard.customDashboardsTitle')}
        />
        <section aria-label={t('in-components:pageStructure.contentAriaLabel')} className={locals.content}>
          <DashboardWidget dashboardTileProps={dashboardTileProps} maxItems={null} viewAll={false} mainPage />
        </section>
      </div>
    </>
  );
}
