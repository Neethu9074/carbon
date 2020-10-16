import theme from 'in-themes';
import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import { setLandingPage, isLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/cockpit';
import { hasApplicationsAccess, hasWebsitesAccess, hasMobileAppsAccess } from 'in-stores/permission';
import CreateApplicationDialog from 'in-applications/creation/Dialog/CreateApplicationDialog';
import { getNewApplicationWaiterViewPath } from 'in-applications/creation/CreateApplication';
import { createNewApplicationConfig, getApplicationConfig } from 'in-api/applicationConfigs';
import DashboardSwitcher from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcher';
import OpenIncidentsButton from 'in-cockpit/Cockpit/components/OpenIncidentsButton';
import Grid, { getWidgetId } from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import SetAsLandingPage from 'in-client/js/LandingPage/SetAsLandingPage';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { pcfEnabled, vsphereEnabled } from 'in-services/featureFlags';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { settings$, setSingle } from 'in-services/settings/settings';
import { evaluateClassNames } from 'in-services/util/classnames';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { successObservable } from 'in-services/util/result';
import { hasKubernetesAccess } from 'in-stores/permission';
import { convertRemToPx } from 'in-services/util/dom';
import { getTimeConfig } from 'in-stores/time/config';
import useObservable from 'in-hooks/useObservable';
import SideNav from 'in-new-components/SideNav';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';

import draggableCardLocals from 'in-custom-dashboards/widgets/TopListWidget/DraggableLightCard.mless';
import locals from './Cockpit.mless';

const settingsKey = 'cockpit_widget_ordering';

const configEnrichmentLookUpTable = {
  '1': {
    type: 'websitesAndMobileTopList',
    config: {
      label: getWebsiteAndMobileLabel(),
      icon: getWebsiteAndMobileIcon(),
      cardIcon: `${getWebsiteAndMobileIcon()}_inverted`
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
          colors: [theme.lib.colors.orange800, theme.lib.colors.red800, theme.lib.colors.yellow800],
          formatter: 'number.compact',
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
          formatter: 'number.compact',
          renderer: 'line',
          metrics: []
        },
        type: 'TIME_SERIES',
        primaryContextMenuAction: 'showEvents',
        additionalContextMenuButtons: [
          {
            name: 'showEvents',
            icon: 'lib_events_inverted',
            label: 'View Events',
            getHref$: highlightedTime =>
              getEventsViewFilteredBy({
                timeConfig: highlightedTime
              })
          }
        ]
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
        <Title title="Home" />
        <ViewTrackingMeta
          data={{
            productArea: 'Home',
            pageRootName: 'Home'
          }}
        />

        <Sticky header={<Header />}>
          <Content itemOrder={filterItems(getOrderedItems(settings))} />
        </Sticky>
      </>
    );
  }
);

function Header() {
  return (
    <>
      <DashboardHeader
        label={<DashboardSwitcher />}
        theme={themes.light}
        renderButtonLine={renderButtonLine}
        renderButtonLineSecondary={() => (
          <>
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

            {role.canConfigureUsers && (
              <Button
                kind="secondaryDarker"
                icon="lib_alerts_user_impacted"
                href$={getModifiedUrlStream(params => {
                  params.pathname = '/config/team/accessControl/users';
                })}
              >
                Add User
              </Button>
            )}

            <SetAsLandingPage isLandingPage={isLandingPage}>
              {({ label, icon, isAlreadyLandingPage }) =>
                !isAlreadyLandingPage && (
                  <Button kind="secondaryDarker" icon={icon} onClick={setLandingPage}>
                    {label}
                  </Button>
                )
              }
            </SetAsLandingPage>
          </>
        )}
      />
      <DashboardHeaderShadowModule />
    </>
  );
}

const Content = getElementDimensions(function Content({ itemOrder, width, timeConfig, applicationId }) {
  const setNewItemOrder = items => {
    items = items.slice();
    items.sort((i1, i2) => i1.y - i2.y);
    setSingle(settingsKey, { ordering: items.map(({ id, x, y }) => ({ id, x, y })) });
  };

  const renderNavigation = width > 1200;
  const entityResult = useObservable(getConfig, [applicationId]);

  return (
    <div className={locals.wrapper}>
      <>
        <div className={locals.left}>
          {width && (
            <Grid
              config={{
                widgets: itemOrder.map(config => ({
                  ...config,
                  ...configEnrichmentLookUpTable[config.id],
                  setApDialogOpen: () =>
                    addActiveDialog(
                      <CreateApplicationDialog
                        timeConfig={timeConfig || getTimeConfig({ pathname: '/applications', query: {} })}
                        formData={entityResult.data}
                        onClose={close}
                        getOnSavePath={app => getNewApplicationWaiterViewPath(app)}
                        editMode
                      />
                    )
                }))
              }}
              isResizable={false}
              width={width - convertRemToPx(renderNavigation ? 18 : 3)}
              onLayoutChange={setNewItemOrder}
              draggableHandle={draggableCardLocals.dragHandleIcon}
            />
          )}
        </div>
        {renderNavigation && (
          <div className={locals.right}>
            <SideNav
              className={locals.nav}
              navItems={itemOrder.map(config => ({
                scrollId: getWidgetId(config.id),
                ...configEnrichmentLookUpTable[config.id].config
              }))}
              renderPreIcon={renderIcon}
            />
          </div>
        )}
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

function getOrderedItems(settings) {
  const orderingFromSettings = settings[settingsKey];
  return (orderingFromSettings
    ? orderingFromSettings.ordering
    : [
        {
          id: '1',
          x: 0,
          y: 0
        },
        {
          id: '2',
          x: 0,
          y: 4
        },
        {
          id: '3',
          x: 0,
          y: 8
        },
        {
          id: '4',
          x: 0,
          y: 12
        },
        {
          id: '5',
          x: 0,
          y: 16
        }
      ]
  ).map(widget => ({ ...widget, width: 12, height: 3 }));
}

function filterItems(orderedItems) {
  return orderedItems.filter(({ id }) => {
    if (id === '1' && !hasWebsitesAccess && !hasMobileAppsAccess) {
      return false;
    } else if (id === '2' && !hasApplicationsAccess) {
      return false;
    }
    return true;
  });
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

function getWebsiteAndMobileIcon() {
  if (!hasMobileAppsAccess) {
    return 'lib_website';
  }
  if (!hasWebsitesAccess) {
    return 'lib_mobile_app';
  }
  return 'lib_website_mobile_app';
}

function getWebsiteAndMobileLabel() {
  if (!hasMobileAppsAccess) {
    return 'Websites';
  }
  if (!hasWebsitesAccess) {
    return 'Mobile Apps';
  }
  return 'Websites & Mobile Apps';
}

function getConfig([applicationId]) {
  return applicationId ? getApplicationConfig(applicationId) : successObservable(createNewApplicationConfig());
}
