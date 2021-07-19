/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { useMemo } from 'react';
import React from 'react';

import { Button, SvgIcon } from '@instana/components';

import {
  hasApplicationsAccess,
  hasKubernetesAccess,
  hasMobileAppsAccess,
  hasWebsitesAccess
} from 'in-stores/permission';
import { isLandingPage, setLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/cockpit';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import WebsitesAndMobileTopList from 'in-cockpit/Cockpit/components/WebsitesAndMobileTopList';
import DashboardSwitcher from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcher';
import InfrastructureTopList from 'in-cockpit/Cockpit/components/InfrastructureTopList';
import ApplicationsTopList from 'in-cockpit/Cockpit/components/ApplicationsTopList';
import OpenIncidentsButton from 'in-cockpit/Cockpit/components/OpenIncidentsButton';
import PlatformsTopList from 'in-cockpit/Cockpit/components/PlatformsTopList';
import EventChartCard from 'in-cockpit/Cockpit/components/EventChartCard';
import SetAsLandingPage from 'in-client/js/LandingPage/SetAsLandingPage';
import DashboardHeader, { themes } from 'in-components/DashboardHeader';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { pcfEnabled, vsphereEnabled } from 'in-services/featureFlags';
import { setSingle, settings$ } from 'in-services/settings/settings';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import SideNav from 'in-components/SideNav';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Cockpit.mless';

const settingsKey = 'cockpit_widget_ordering';

const itemIds = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];

const LUT = {
  '1': WebsitesAndMobileTopList,
  '2': ApplicationsTopList,
  '3': PlatformsTopList,
  '4': InfrastructureTopList,
  '5': EventChartCard
};

const configEnrichmentLookUpTable = {
  '1': {
    label: getWebsiteAndMobileLabel(),
    icon: getWebsiteAndMobileIcon(),
    cardIcon: `${getWebsiteAndMobileIcon()}_inverted`
  },
  '2': {
    label: t('in-cockpit:cockpit.applications'),
    icon: 'lib_application',
    cardIcon: 'lib_application_invert'
  },
  '3': {
    label: getPlatformsTitle(),
    icon: `${getPlatformCardIcon()}`,
    cardIcon: `${getPlatformCardIcon()}_inverted`
  },

  '4': {
    label: t('in-cockpit:cockpit.infrastructure'),
    icon: 'lib_infrastructure',
    cardIcon: 'lib_infrastructure_inverted'
  },
  '5': {
    label: t('in-cockpit:cockpit.events'),
    icon: 'lib_events_inverted',
    cardIcon: 'lib_events_inverted'
  }
};

export default connectTo(
  {
    settings: settings$
  },
  function Cockpit({ settings }) {
    const { ref, width } = useResizeObserverCustom();

    return (
      <div ref={ref}>
        <CockpitInner settings={settings} width={width} />
      </div>
    );
  }
);

function CockpitInner({ settings, width }) {
  return useMemo(
    () => (
      <>
        <Title title={t('in-cockpit:cockpit.home')} />
        <ViewTrackingMeta
          data={{
            productArea: 'Home',
            pageRootName: 'Home'
          }}
        />
        <Sticky header={<Header />}>
          <Content width={width} itemOrder={filterItems(getOrderedItems(settings))} />
        </Sticky>
      </>
    ),
    [width, settings]
  );
}

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
                {t('in-cockpit:cockpit.deployAgent')}
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
                {t('in-cockpit:cockpit.addUser')}
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

const Content = function Content({ itemOrder, applicationId, width }) {
  const setNewItemOrder = items => {
    setSingle(settingsKey, { ordering: items.map(({ id }, i) => ({ id, x: 0, y: i * 10 })) });
  };

  const renderNavigation = width > 1200;

  return (
    <div
      className={classNames(locals.wrapper, {
        [locals.wrapperWithRightContent]: !!renderNavigation
      })}
    >
      <div
        className={classNames(locals.left, {
          [locals.contentNoPaddingRight]: !!renderNavigation
        })}
      >
        {width && (
          <DragDropContext
            onDragEnd={({ source, destination }) => {
              if (!destination) {
                return;
              }

              const copiedItems = itemOrder.slice();
              copiedItems[source.index] = itemOrder[destination.index];
              copiedItems[destination.index] = itemOrder[source.index];
              setNewItemOrder(copiedItems);
            }}
          >
            <Droppable droppableId="droppable">
              {provided => (
                <div ref={provided.innerRef}>
                  {itemOrder.map((_config, i) => {
                    const Widget = LUT[_config.id];
                    if (!Widget) {
                      return null;
                    }

                    return (
                      <Draggable key={_config.id} draggableId={_config.id} index={i}>
                        {provided => (
                          <div
                            id={_config.id}
                            className={locals.item}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <Widget
                              applicationId={applicationId}
                              dragAndDropConfig={provided.dragHandleProps}
                              config={{
                                ...configEnrichmentLookUpTable[_config.id],
                                dragAndDropConfig: provided.dragHandleProps
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
      {renderNavigation && (
        <div className={locals.right}>
          <SideNav
            className={locals.nav}
            navItems={itemOrder.map(config => ({
              scrollId: config.id,
              ...configEnrichmentLookUpTable[config.id]
            }))}
            renderPreIcon={renderIcon}
          />
        </div>
      )}
    </div>
  );
};

function renderIcon({ icon }, isSelected) {
  return (
    <SvgIcon
      className={classNames({
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
  if (orderingFromSettings) {
    const result = orderingFromSettings.ordering;
    itemIds.forEach(item => {
      if (!result.find(r => r.id === item.id)) {
        result.push(item);
      }
    });
    return orderingFromSettings.ordering;
  }

  return itemIds;
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
    return t('in-cockpit:cockpit.platforms');
  }

  if (pcfEnabled) {
    return t('in-cockpit:cockpit.cloudFoundry');
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
    return t('in-cockpit:cockpit.websites');
  }
  if (!hasWebsitesAccess) {
    return t('in-cockpit:cockpit.mobileApps');
  }
  return t('in-cockpit:cockpit.websitesMobileApps');
}
