/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import DashboardSwitcherComponent from 'promise-loader?global,customdashboard!in-custom-dashboards/DashboardSwitcher/DashboardSwitcher';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import React, { useMemo, useState, memo } from 'react';
import { InView } from 'react-intersection-observer';
import classNames from 'classnames';

import { Link, Message, SvgIcon, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  hasAPlatformAccess,
  hasApplicationsAccess,
  hasEventsAccess,
  hasInfrastructureAccess,
  hasKubernetesAccess,
  hasMobileAppsAccess,
  hasOpenStackAccess,
  hasPCFAccess,
  hasPHMCAccess,
  hasPowerVcAccess,
  hasVSphereAccess,
  hasWebsitesAccess,
  hasZHMCAccess,
  hasSAPAccess,
  hasBizOpsAccess
} from 'in-stores/permission';
import { MessageContentModernDesign } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
import getLegacyAlertConfigStats from 'in-alerting/smart-alerts/subscriptions/getLegacyAlertConfigStats';
import { isLandingPage, setLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/cockpit';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { deprecatedValue } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/util';
import BusinessMonitoringTopList from 'in-cockpit/Cockpit/components/BusinessMonitoringTopList';
import { APPLICATIONS_ALERTING_MIGRATION_BANNER_EVENTS } from 'in-services/tracking/tracking';
import WebsitesAndMobileTopList from 'in-cockpit/Cockpit/components/WebsitesAndMobileTopList';
import InfrastructureTopList from 'in-cockpit/Cockpit/components/InfrastructureTopList';
import ApplicationsTopList from 'in-cockpit/Cockpit/components/ApplicationsTopList';
import OpenIncidentsButton from 'in-cockpit/Cockpit/components/OpenIncidentsButton';
import { events, globalSettingsAlertingEvents } from 'in-settings/navigation/paths';
import { securityAndAccessAccessControlUsers } from 'in-settings/navigation/paths';
import { createAsyncComponent } from 'in-components/routing/createAsyncComponent';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import PlatformsTopList from 'in-cockpit/Cockpit/components/PlatformsTopList';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import EventChartCard from 'in-cockpit/Cockpit/components/EventChartCard';
import SetAsLandingPage from 'in-client/js/LandingPage/SetAsLandingPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader, { themes } from 'in-components/DashboardHeader';
import { setSingle, settings$ } from 'in-services/settings/settings';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import { productAreas } from 'in-services/tracking/productAreas';
import UserGoalSelection from 'in-plg/pages/UserGoalSelection';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { playwithEnabled } from 'in-services/featureFlags';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import SideNav from 'in-components/SideNav';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

import locals from './Cockpit.mless';

const settingsKey = 'cockpit_widget_ordering';

const itemIds = [];

const LUT = {
  5: EventChartCard
};

const configEnrichmentLookUpTable = {
  5: {
    label: t('in-cockpit:cockpit.events'),
    icon: 'lib_events_inverted',
    cardIcon: 'lib_events_inverted'
  }
};

if (hasMobileAppsAccess || hasWebsitesAccess) {
  itemIds.push({ id: '1' });
  LUT['1'] = WebsitesAndMobileTopList;

  configEnrichmentLookUpTable['1'] = {
    label: getWebsiteAndMobileLabel(),
    icon: getWebsiteAndMobileIcon(),
    cardIcon: `${getWebsiteAndMobileIcon()}_inverted`
  };
}

if (hasApplicationsAccess) {
  itemIds.push({ id: '2' });
  LUT['2'] = ApplicationsTopList;

  configEnrichmentLookUpTable['2'] = {
    label: t('in-cockpit:cockpit.applications'),
    icon: 'lib_application',
    cardIcon: 'lib_application_invert'
  };
}

if (hasAPlatformAccess) {
  itemIds.push({ id: '3' });
  LUT['3'] = PlatformsTopList;

  configEnrichmentLookUpTable['3'] = {
    label: getPlatformsTitle(),
    icon: `${getPlatformCardIcon()}`,
    cardIcon: `${getPlatformCardIcon()}_inverted`
  };
}

if (hasInfrastructureAccess) {
  itemIds.push({ id: '4' });
  LUT['4'] = InfrastructureTopList;
  configEnrichmentLookUpTable['4'] = {
    label: t('in-cockpit:cockpit.infrastructure'),
    icon: 'lib_infrastructure',
    cardIcon: 'lib_infrastructure_inverted'
  };
}

if (hasEventsAccess) {
  itemIds.push({ id: '5' });
  LUT['5'] = EventChartCard;
  configEnrichmentLookUpTable['5'] = {
    label: t('in-cockpit:cockpit.events'),
    icon: 'lib_events_inverted',
    cardIcon: 'lib_events_inverted'
  };
}

// adds the business monitoring section
if (hasBizOpsAccess) {
  itemIds.push({ id: '6' });
  LUT['6'] = BusinessMonitoringTopList;
  configEnrichmentLookUpTable['6'] = {
    label: t('in-cockpit:cockpit.bizops'),
    icon: 'lib_bizops',
    cardIcon: 'lib_bizops'
  };
}

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
            productArea: productAreas.home,
            pageRootName: pageNames.home
          }}
        />
        <UserGoalSelection />
        <Sticky header={<Header />}>
          <Content width={width} itemOrder={filterItems(getOrderedItems(settings))} />
        </Sticky>
      </>
    ),
    [width, settings]
  );
}

function Header() {
  const { createHrefToPath } = useNavigation();

  const DashboardSwitcher = createAsyncComponent(
    <LoadingIndicator size="xs" style={{ height: '16px' }} />,
    DashboardSwitcherComponent
  );
  return (
    <>
      <DashboardHeader
        label={<DashboardSwitcher />}
        theme={themes.light}
        renderButtonLine={renderButtonLine}
        renderButtonLineSecondary={() => (
          <>
            {role.canConfigureAgents && !playwithEnabled && (
              <Button
                size="compact"
                kind="secondaryDarker"
                icon="lib_actions_settings"
                href={createHrefToPath('/agents/installation')}
              >
                {t('in-cockpit:cockpit.deployAgent')}
              </Button>
            )}

            {role.canConfigureUsers && !playwithEnabled && (
              <Button
                size="compact"
                kind="secondaryDarker"
                icon="lib_alerts_user_impacted"
                href={createHrefToPath(securityAndAccessAccessControlUsers)}
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

function CustomEventDeprecatedWarning({ legacyAlertConfigStats }) {
  const { location, createHref } = useNavigation();
  const affectedEventsListTarget = { ...location, pathname: globalSettingsAlertingEvents };
  setOrDeleteMatrixKey(affectedEventsListTarget, events, 'type', deprecatedValue);
  const { trackCta } = useSegmentTracking();

  const deprecatedCustomEvents = legacyAlertConfigStats.data?.deprecatedCustomEvents;

  return (
    <Message type="warning" inline className={locals.customEventDeprecatedWarning} withIcon fullInlineWidth dismissible>
      <MessageContentModernDesign>
        <Trans
          i18nKey="in-cockpit:cockpit.customEventDeprecatedWarning"
          components={{
            affectedCustomEvents: (
              <Link
                href={createHref(affectedEventsListTarget)}
                onClick={() => trackCta(APPLICATIONS_ALERTING_MIGRATION_BANNER_EVENTS, { deprecatedCustomEvents })}
              >
                &nbsp;
              </Link>
            )
          }}
          values={{ count: deprecatedCustomEvents }}
        />
      </MessageContentModernDesign>
    </Message>
  );
}

const Content = function Content({ itemOrder, applicationId, width }) {
  const legacyAlertConfigStats = useObservable(getLegacyAlertConfigStats, []) ?? pendingResult;
  const [internalItemOrder, setItemOrder] = useState(itemOrder);

  const setNewItemOrder = items => {
    setSingle(settingsKey, { ordering: items.map(({ id }, i) => ({ id, x: 0, y: i * 10 })) });
    setItemOrder(items);
  };

  const renderNavigation = width > 1200;
  return (
    <div
      className={classNames(locals.wrapper, {
        [locals.wrapperWithRightContent]: !!renderNavigation,
        [locals.marginTop57]: playwithEnabled
      })}
    >
      <div
        className={classNames(locals.left, {
          [locals.contentNoPaddingRight]: !!renderNavigation
        })}
      >
        {width && (
          <>
            {role.canConfigureEventsAndAlerts && legacyAlertConfigStats.data?.deprecatedCustomEvents > 0 && (
              <CustomEventDeprecatedWarning legacyAlertConfigStats={legacyAlertConfigStats} />
            )}
            <DragDropContext
              onDragEnd={({ source, destination }) => {
                if (!destination) {
                  return;
                }

                const copiedItems = internalItemOrder.slice();
                copiedItems[source.index] = internalItemOrder[destination.index];
                copiedItems[destination.index] = internalItemOrder[source.index];
                setNewItemOrder(copiedItems);
              }}
            >
              <Droppable droppableId="droppable">
                {provided => (
                  <div ref={provided.innerRef}>
                    {internalItemOrder.map((_config, i) => {
                      const Widget = LUT[_config.id];
                      if (!Widget) {
                        return null;
                      }

                      const MemoizedWidget = memo(Widget);

                      return (
                        <Draggable key={_config.id} draggableId={_config.id} index={i}>
                          {provided => (
                            <div
                              id={_config.id}
                              className={locals.item}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <InView triggerOnce>
                                {({ inView, ref }) => (
                                  <div ref={ref}>
                                    {inView && (
                                      <MemoizedWidget
                                        applicationId={applicationId}
                                        dragAndDropConfig={provided.dragHandleProps}
                                        config={{
                                          ...configEnrichmentLookUpTable[_config.id],
                                          dragAndDropConfig: provided.dragHandleProps
                                        }}
                                      />
                                    )}
                                    {!inView && (
                                      <div {...provided.dragHandleProps}>
                                        <LoadingIndicator />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </InView>
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
          </>
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
  if (hasPCFAccess) numPlatformsAvailable++;
  if (hasVSphereAccess) numPlatformsAvailable++;
  if (hasOpenStackAccess) numPlatformsAvailable++;
  if (hasPHMCAccess) numPlatformsAvailable++;
  if (hasPowerVcAccess) numPlatformsAvailable++;
  if (hasZHMCAccess) numPlatformsAvailable++;
  if (hasSAPAccess) numPlatformsAvailable++;
  if (numPlatformsAvailable > 1) {
    return t('in-cockpit:cockpit.platforms');
  }

  if (hasPCFAccess) {
    return t('in-cockpit:cockpit.cloudFoundry');
  }
  if (hasVSphereAccess) {
    return t('in-cockpit:cockpit.vsphere');
  }
  if (hasOpenStackAccess) {
    return t('in-cockpit:cockpit.openstack');
  }
  if (hasPHMCAccess) {
    return t('in-cockpit:cockpit.ibmp');
  }
  if (hasPowerVcAccess) {
    return t('in-cockpit:cockpit.powervcRegion');
  }
  if (hasSAPAccess) {
    return t('in-cockpit:cockpit.sap');
  }
  if (hasZHMCAccess) {
    return t('in-cockpit:cockpit.ibmz');
  }
  if (hasKubernetesAccess) {
    return t('in-cockpit:cockpit.kubernetes');
  }
  return null;
}

function getPlatformCardIcon() {
  let numPlatformsAvailable = 0;
  if (hasKubernetesAccess) numPlatformsAvailable++;
  if (hasPCFAccess) numPlatformsAvailable++;
  if (hasVSphereAccess) numPlatformsAvailable++;
  if (hasOpenStackAccess) numPlatformsAvailable++;
  if (hasPHMCAccess) numPlatformsAvailable++;
  if (hasPowerVcAccess) numPlatformsAvailable++;
  if (hasZHMCAccess) numPlatformsAvailable++;
  if (hasSAPAccess) numPlatformsAvailable++;
  if (numPlatformsAvailable > 1) {
    return 'lib_platforms';
  }
  if (hasPCFAccess) {
    return 'lib_cloudfoundry';
  }
  if (hasVSphereAccess) {
    return 'lib_vsphere';
  }
  if (hasOpenStackAccess) {
    return 'lib_openstack';
  }
  if (hasPHMCAccess) {
    return 'lib_phmc_console';
  }
  if (hasPowerVcAccess) {
    return 'lib_powervc';
  }
  if (hasZHMCAccess) {
    return 'lib_zhmcConsole';
  }
  if (hasKubernetesAccess) {
    return 'lib_kubernetes';
  }
  if (hasSAPAccess) {
    return 'lib_sap';
  }
  return null;
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
