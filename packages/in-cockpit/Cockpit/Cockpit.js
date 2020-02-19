import theme from 'in-themes';
import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import Grid, { getWidgetId } from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import { mobileAppMonitoringEnabled } from 'in-services/featureFlags';
import SetAsLandingPage from 'in-cockpit/Cockpit/SetAsLandingPage';
import DashboardHeader from 'in-new-components/DashboardHeader';
import SetBodyColor from 'in-components/SetBodyColor';
import SideNav from 'in-new-components/SideNav';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';

import locals from './Cockpit.mless';

export default function Cockpit() {
  return (
    <>
      <SetBodyColor color={theme.lib.colors.N100} />

      <Sticky
        header={
          <>
            <DashboardHeader label="System Overview" renderButtonLineSecondary={() => <SetAsLandingPage />} />
            <DashboardHeaderShadowModule />
          </>
        }
      >
        <div className={locals.wrapper}>
          <div className={locals.left}>
            <Grid
              config={{
                widgets: [
                  {
                    id: '1',
                    width: 10,
                    height: 3,
                    x: 0,
                    y: 4,
                    type: 'websitesAndMobileTopList',
                    title: mobileAppMonitoringEnabled ? 'Websites & Mobile Apps' : 'Websites'
                  },
                  {
                    id: '2',
                    width: 10,
                    height: 3,
                    x: 0,
                    y: 0,
                    type: 'applicationsTopList',
                    title: 'Applications'
                  },
                  {
                    id: '3',
                    width: 10,
                    height: 3,
                    x: 0,
                    y: 8,
                    type: 'infrastructureTopList',
                    title: 'Infrastructure'
                  }
                ]
              }}
              isEditing={false}
            />
          </div>
          <div className={locals.right}>
            <Sticky
              header={
                <SideNav
                  scrollToTopOnFirstItemClicked
                  navItems={[
                    {
                      scrollId: getWidgetId('1'),
                      icon: mobileAppMonitoringEnabled ? 'lib_website_mobile_app' : 'lib_website',
                      label: mobileAppMonitoringEnabled ? 'Websites & Mobile Apps' : 'Websites'
                    },
                    { scrollId: getWidgetId('2'), icon: 'lib_application', label: 'Applications' },
                    { scrollId: getWidgetId('3'), icon: 'lib_infrastructure', label: 'Infrastructure' }
                  ]}
                  renderPreIcon={renderIcon}
                />
              }
            />
          </div>
        </div>
      </Sticky>
    </>
  );
}

function renderIcon({ icon }) {
  return <SvgIcon className={locals.icon} type={icon} size="s" />;
}
