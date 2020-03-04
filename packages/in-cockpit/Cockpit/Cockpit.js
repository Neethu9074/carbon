import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import OpenIncidentsButton from 'in-cockpit/Cockpit/components/OpenIncidentsButton';
import Grid, { getWidgetId } from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { mobileAppMonitoringEnabled } from 'in-services/featureFlags';
import { pcfEnabled, vsphereEnabled } from 'in-services/featureFlags';
import { settings$, setSingle } from 'in-services/settings/settings';
import SetAsLandingPage from 'in-cockpit/Cockpit/SetAsLandingPage';
import { evaluateClassNames } from 'in-services/util/classnames';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { hasKubernetesAccess } from 'in-stores/permission';
import { convertRemToPx } from 'in-services/util/dom';
import SetBodyColor from 'in-components/SetBodyColor';
import Lettering from 'in-components/Lettering';
import SideNav from 'in-new-components/SideNav';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import theme from 'in-themes';

import draggableCardLocals from 'in-custom-dashboards/widgets/TopListWidget/DraggableLightCard.mless';
import locals from './Cockpit.mless';

const settingsKey = 'cockpit_widget_ordering';

const configEnrichmentLookUpTable = {
  '1': {
    type: 'websitesAndMobileTopList',
    config: {
      label: mobileAppMonitoringEnabled ? 'Websites & Mobile Apps' : 'Websites',
      icon: mobileAppMonitoringEnabled ? 'lib_website_mobile_app' : 'lib_website',
      cardIcon: mobileAppMonitoringEnabled ? 'lib_website_mobile_app_inverted' : 'lib_website_inverted'
    }
  },
  '2': {
    type: 'applicationsTopList',
    config: {
      label: 'Applications',
      icon: 'lib_application',
      cardIcon: 'lib_application_invert'
    }
  },
  '3': {
    type: 'platformsTopList',
    config: {
      label: getPlatformsTitle(),
      icon: `${getPlatformCardIcon()}`,
      cardIcon: `${getPlatformCardIcon()}_inverted`
    }
  },
  '4': {
    type: 'infrastructureTopList',
    config: {
      label: 'Infrastructure',
      icon: 'lib_infrastructure',
      cardIcon: 'lib_infrastructure_inverted'
    }
  },
  '5': {
    type: 'eventChartCard',
    config: {
      label: 'Events',
      icon: 'lib_events_inverted',
      cardIcon: 'lib_events_inverted',
      chartConfig: {
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
  }
};

export default connectTo(
  {
    settings: settings$
  },
  function Cockpit({ settings }) {
    return (
      <>
        <SetBodyColor color={theme.lib.colors.N100} />

        <Sticky header={<Header />}>
          <Content itemOrder={getOrdering(settings)} />
        </Sticky>
      </>
    );
  }
);

function Header() {
  return (
    <>
      <DashboardHeader
        label={<Lettering className={locals.lettering} />}
        theme={themes.light}
        renderButtonLine={renderButtonLine}
        renderButtonLineSecondary={() => (
          <>
            <SetAsLandingPage />
            {role.canConfigureAgents && (
              <Button
                kind="secondaryDarker"
                icon="lib_actions_settings"
                href$={getModifiedUrlStream(params => {
                  params.pathname = '/agents/installation';
                })}
              >
                Deploy Agent
              </Button>
            )}
            <Button
              kind="secondaryDarker"
              icon="lib_alerts_user_impacted"
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
  );
}

const Content = getElementDimensions(function Content({ itemOrder, width }) {
  const setNewItemOrder = items => {
    items = items.slice();
    items.sort((i1, i2) => i1.y - i2.y);
    setSingle(settingsKey, { ordering: items });
  };

  return (
    <div className={locals.wrapper}>
      <>
        <div className={locals.left}>
          {width && (
            <Grid
              config={{
                widgets: itemOrder.map(config => ({
                  ...config,
                  ...configEnrichmentLookUpTable[config.id]
                }))
              }}
              isEditing
              isResizable={false}
              rowHeightPixels={130}
              width={width - convertRemToPx(18)}
              onLayoutChange={setNewItemOrder}
              draggableHandle={draggableCardLocals.dragHandleIcon}
            />
          )}
        </div>
        <div className={locals.right}>
          {width && (
            <SideNav
              className={locals.nav}
              navItems={itemOrder.map(config => ({
                scrollId: getWidgetId(config.id),
                ...configEnrichmentLookUpTable[config.id].config
              }))}
              renderPreIcon={renderIcon}
            />
          )}
        </div>
      </>
    </div>
  );
});

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

function getOrdering(settings) {
  const orderingFromSettings = settings[settingsKey];
  return orderingFromSettings
    ? orderingFromSettings.ordering
    : [
        {
          id: '1',
          width: 12,
          height: 3,
          x: 0,
          y: 0
        },
        {
          id: '2',
          width: 12,
          height: 3,
          x: 0,
          y: 4
        },
        {
          id: '3',
          width: 12,
          height: 3,
          x: 0,
          y: 8
        },
        {
          id: '4',
          width: 12,
          height: 3,
          x: 0,
          y: 12
        },
        {
          id: '5',
          width: 12,
          height: 3,
          x: 0,
          y: 16
        }
      ];
}

function getPlatformsTitle() {
  let numPlatformsAvailable = 0;
  if (hasKubernetesAccess) numPlatformsAvailable++;
  if (pcfEnabled) numPlatformsAvailable++;
  if (vsphereEnabled) numPlatformsAvailable++;
  if (numPlatformsAvailable > 1) {
    return 'Platforms';
  }
  if (pcfEnabled) {
    return 'Cloud Foundry';
  }
  if (vsphereEnabled) {
    return 'vSphere';
  }
  return 'Kubernetes';
}

function getPlatformCardIcon() {
  let numPlatformsAvailable = 0;
  if (hasKubernetesAccess) numPlatformsAvailable++;
  if (pcfEnabled) numPlatformsAvailable++;
  if (vsphereEnabled) numPlatformsAvailable++;
  if (numPlatformsAvailable > 1) {
    return 'lib_platforms';
  }
  if (pcfEnabled) {
    return 'lib_cloudfoundry';
  }
  if (vsphereEnabled) {
    return 'lib_vsphere';
  }
  return 'lib_kubernetes';
}
