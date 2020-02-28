import React, { useState } from 'react';
import theme from 'in-themes';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import OpenIncidentsButton from 'in-cockpit/Cockpit/components/OpenIncidentsButton';
import Grid, { getWidgetId } from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { mobileAppMonitoringEnabled } from 'in-services/featureFlags';
import SetAsLandingPage from 'in-cockpit/Cockpit/SetAsLandingPage';
import { evaluateClassNames } from 'in-services/util/classnames';
import SetBodyColor from 'in-components/SetBodyColor';
import Lettering from 'in-components/Lettering';
import SideNav from 'in-new-components/SideNav';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';

import locals from './Cockpit.mless';

const configEnrichmentLookUpTable = {
  '1': {
    type: 'websitesAndMobileTopList',
    title: mobileAppMonitoringEnabled ? 'Websites & Mobile Apps' : 'Websites'
  },
  '2': {
    type: 'applicationsTopList',
    title: 'Applications'
  },
  '3': {
    type: 'platformsTopList',
    title: 'Platforms'
  },
  '4': {
    type: 'infrastructureTopList',
    title: 'Infrastructure'
  },
  '5': {
    type: 'eventChartCard',
    config: {
      y1: {
        formatter: 'number.detailed',
        renderer: 'stackedBar',
        metrics: [
          {
            dynamicFocusQuery: 'event.type:incident ',
            metric: 'eventCount',
            timeShift: 0,
            aggregation: 'DISTINCT_COUNT',
            label: 'Incidents',
            source: 'EVENT'
          },
          {
            dynamicFocusQuery: 'event.severity:10 event.type:issue ',
            metric: 'eventCount',
            timeShift: 0,
            aggregation: 'DISTINCT_COUNT',
            label: 'Critical',
            source: 'EVENT'
          },
          {
            dynamicFocusQuery: 'event.severity:5 event.type:issue ',
            metric: 'eventCount',
            timeShift: 0,
            aggregation: 'DISTINCT_COUNT',
            label: 'Warning',
            source: 'EVENT'
          }
        ]
      },
      y2: {
        formatter: 'number.detailed',
        renderer: 'line',
        metrics: []
      },
      type: 'TIME_SERIES'
    }
  }
};

const navLookUpTable = {
  '1': {
    icon: mobileAppMonitoringEnabled ? 'lib_website_mobile_app' : 'lib_website',
    label: mobileAppMonitoringEnabled ? 'Websites & Mobile Apps' : 'Websites'
  },
  '2': {
    icon: 'lib_application',
    label: 'Applications'
  },
  '3': {
    icon: 'lib_platforms',
    label: 'Platforms'
  },
  '4': {
    icon: 'lib_infrastructure',
    label: 'Infrastructure'
  },
  '5': {
    icon: 'lib_events_inverted',
    label: 'Events'
  }
};

export default function Cockpit() {
  const [itemOrder, setItemOrder] = useState([
    {
      id: '1',
      width: 10,
      height: 3,
      x: 0,
      y: 0
    },
    {
      id: '2',
      width: 10,
      height: 3,
      x: 0,
      y: 4
    },
    {
      id: '3',
      width: 10,
      height: 3,
      x: 0,
      y: 8
    },
    {
      id: '4',
      width: 10,
      height: 3,
      x: 0,
      y: 12
    },
    {
      id: '5',
      width: 10,
      height: 2,
      x: 0,
      y: 16
    }
  ]);
  const setNewItemOrder = items => {
    items = items.slice();
    items.sort((i1, i2) => i1.y - i2.y);
    setItemOrder(items);
  };

  return (
    <>
      <SetBodyColor color={theme.lib.colors.N100} />

      <Sticky
        header={
          <>
            <DashboardHeader
              label={<Lettering className={locals.lettering} />}
              renderMetaInformation={renderMetaInformation}
              theme={themes.light}
              renderButtonLine={renderButtonLine}
              renderButtonLineSecondary={() => (
                <>
                  <SetAsLandingPage />
                  {role.canConfigureAgents && (
                    <Button
                      kind="secondaryDarker"
                      icon="lib_alerts_user_impacted"
                      href$={getModifiedUrlStream(params => {
                        params.pathname = '/agents/installation';
                      })}
                    >
                      Deploy Agent
                    </Button>
                  )}
                  <Button
                    kind="secondaryDarker"
                    icon="lib_actions_settings"
                    href$={getModifiedUrlStream(params => {
                      params.pathname = '/config/team/accessControl/users';
                    })}
                  >
                    Add User
                  </Button>
                </>
              )}
            />
            <DashboardHeaderShadowModule />
          </>
        }
      >
        <div className={locals.wrapper}>
          <div className={locals.left}>
            <Grid
              config={{
                widgets: itemOrder.map(config => ({
                  ...config,
                  ...configEnrichmentLookUpTable[config.id]
                }))
              }}
              isEditing={false}
              isResizable={false}
              onLayoutChange={setNewItemOrder}
            />
          </div>
          <div className={locals.right}>
            <SideNav
              className={locals.nav}
              scrollToTopOnFirstItemClicked
              navItems={itemOrder.map(config => ({
                scrollId: getWidgetId(config.id),
                ...navLookUpTable[config.id]
              }))}
              renderPreIcon={renderIcon}
            />
          </div>
        </div>
      </Sticky>
    </>
  );
}

function renderIcon({ icon }, isSelected) {
  return (
    <SvgIcon
      className={evaluateClassNames({
        [locals.icon]: true,
        [locals.iconSelected]: isSelected
      })}
      type={icon}
      size="s"
    />
  );
}

function renderButtonLine() {
  return <OpenIncidentsButton />;
}

function renderMetaInformation() {
  const { tenant, tenantUnit } = window.instana.config;
  return (
    <span className={locals.tuInformation}>
      {tenant}/{tenantUnit}
    </span>
  );
}
