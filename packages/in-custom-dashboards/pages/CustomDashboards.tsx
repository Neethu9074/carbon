/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect } from 'react';

import { ThemeProvider } from '@instana/components';

import CustomDashboardsHeader from 'in-custom-dashboards/pages/components/CustomDashboardsHeader';
import DashboardWidget from 'in-plg/pages/WelcomePage/widgets/DashboardWidget';
import { getWidget } from 'in-plg/pages/WelcomePage/PageContent';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/pages/CustomDashboards.mless';

export default function CustomDashboards() {
  const widgetProps = getWidget('dashboardWidget');
  const dashboardTileProps = {
    ...widgetProps,
    header: '',
    icon: ''
  };

  // Scroll to the top in case the user comes from the widget in the main page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Title title={t('in-custom-dashboards:customDashboard.customDashboardsTitle')} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.custom_dashboard,
          pageName: pageNames.custom_dashboard,
          pageRootName: pageNames.custom_dashboard
        }}
      />
      <div className={locals.container}>
        <ThemeProvider theme="g10">
          <section aria-label={t('in-components:pageStructure.headerAriaLabel')}>
            <CustomDashboardsHeader />
          </section>
          <section aria-label={t('in-components:pageStructure.contentAriaLabel')} className={locals.content}>
            <DashboardWidget dashboardTileProps={dashboardTileProps} maxItems={null} viewAll={false} mainPage />
          </section>
        </ThemeProvider>
      </div>
    </>
  );
}
