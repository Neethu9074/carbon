/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { DragDropContext, Draggable, DraggableProvidedDragHandleProps, Droppable } from 'react-beautiful-dnd';
import React, { ReactNode, useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  hasKubernetesAccess,
  hasOpenStackAccess,
  hasPCFAccess,
  hasPHMCAccess,
  hasPowerVcAccess,
  hasVSphereAccess,
  hasZHMCAccess,
  hasSAPAccess,
  hasWebsitesAccess,
  hasMobileAppsAccess,
  hasApplicationsAccess,
  hasAPlatformAccess,
  hasBizOpsAccess,
  hasInfrastructureAccess,
  hasSyntheticsAccess,
  hasEventsAccess
} from 'in-stores/permission';
import WebsitesAndMobileListWidget from 'in-plg/pages/WelcomePage/widgets/WebsitesAndMobileListWidget';
import SyntheticMonitoringWidget from 'in-plg/pages/WelcomePage/widgets/SyntheticMonitoringWidget';
import BusinessMonitoringWidget from 'in-plg/pages/WelcomePage/widgets/BusinessMonitoringWidget';
import InfrastructureWidget from 'in-plg/pages/WelcomePage/widgets/InfrastructureWidget';
import ApplicationWidget from 'in-plg/pages/WelcomePage/widgets/ApplicationWidget';
import EventsChartWidget from 'in-plg/pages/WelcomePage/widgets/EventsChartWidget';
import IncidentsWidget from 'in-plg/pages/WelcomePage/widgets/IncidentsWidget';
import DashboardWidget from 'in-plg/pages/WelcomePage/widgets/DashboardWidget';
import PlatformWidget from 'in-plg/pages/WelcomePage/widgets/PlatformWidget';
import { QuickLinks } from 'in-plg/pages/WelcomePage/quickLinks/QuickLinks';
import { setSingle, settings$ } from 'in-services/settings/settings';
import { playwithEnabled } from 'in-services/featureFlags';
import { UiSettings } from 'in-types';
import { t } from 'in-i18n';

import locals from './PageContent.mless';

interface WidgetOrdering {
  x?: number;
  y?: number;
  id: string;
}

const settingsKey = 'WidgetOrdering';
const itemIds: WidgetOrdering[] = [];

export interface DashboardTileParamProps {
  key: number;
  header: string;
  icon?: string;
  dragAndDropConfigs?: DraggableProvidedDragHandleProps;
  toggles?: ReactNode;
  toggleCallback?: (index: number) => void;
  sectionLabel?: string;
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
    return t('in-plg:welcomepage.component.platformWidget.platforms');
  }

  if (hasPCFAccess) {
    return t('in-plg:welcomepage.component.platformWidget.cloudFoundry');
  }
  if (hasVSphereAccess) {
    return t('in-plg:welcomepage.component.platformWidget.vsphere');
  }
  if (hasOpenStackAccess) {
    return t('in-plg:welcomepage.component.platformWidget.openstack');
  }
  if (hasPHMCAccess) {
    return t('in-plg:welcomepage.component.platformWidget.ibmp');
  }
  if (hasPowerVcAccess) {
    return t('in-plg:welcomepage.component.platformWidget.powervcRegion');
  }
  if (hasSAPAccess) {
    return t('in-plg:welcomepage.component.platformWidget.sap');
  }
  if (hasZHMCAccess) {
    return t('in-plg:welcomepage.component.platformWidget.ibmz');
  }
  if (hasKubernetesAccess) {
    return t('in-plg:welcomepage.component.platformWidget.kubernetes');
  }
  return '';
}

const syntheticArray = [
  { value: 'test', label: 'Tests' },
  { value: 'location', label: 'Locations' },
  { value: 'smartalerts', label: 'Smart alerts' }
];

const syntheticToogleArray: string[] = syntheticArray.map(ele => ele.label);

const widgetData = [
  {
    key: 'incidentsWidget',
    label: t('in-plg:welcomepage.component.incidentsWidget.label'),
    icon: 'lib_actions_reorder',
    widget: IncidentsWidget
  },
  {
    key: 'dashboardWidget',
    label: t('in-plg:welcomepage.component.dashboardWidget.label'),
    icon: 'lib_actions_reorder',
    widget: DashboardWidget
  },
  {
    key: 'websitesWidget',
    label: t('in-plg:welcomepage.component.websitesWidget.label'),
    icon: 'lib_actions_reorder',
    type: 'website',
    widget: WebsitesAndMobileListWidget
  },
  {
    key: 'mobileListWidget',
    label: t('in-plg:welcomepage.component.mobileAppsWidget.label'),
    icon: 'lib_actions_reorder',
    type: 'mobileApps',
    widget: WebsitesAndMobileListWidget
  },
  {
    key: 'businessMonitoringWidget',
    label: t('in-plg:welcomepage.component.bizopsWidget.label'),
    icon: 'lib_actions_reorder',
    widget: BusinessMonitoringWidget
  },
  {
    key: 'applicationWidget',
    label: t('in-plg:welcomepage.component.applicationWidget.label'),
    icon: 'lib_actions_reorder',
    widget: ApplicationWidget
  },
  {
    key: 'platformsWidget',
    label: getPlatformsTitle(),
    icon: 'lib_actions_reorder',
    widget: PlatformWidget
  },
  {
    key: 'infrastructureWidget',
    label: t('in-plg:welcomepage.component.infrastructureWidget.label'),
    widget: InfrastructureWidget
  },
  {
    key: 'syntheticWidget',
    label: t('in-plg:welcomepage.component.syntheticWidget.label'),
    toogles: syntheticToogleArray,
    syntheticType: 'test',
    widget: SyntheticMonitoringWidget,
    type: 'synthetic'
  },
  {
    key: 'eventsWidget',
    label: t('in-plg:welcomepage.component.eventWidget.label'),
    icon: 'lib_actions_reorder'
  }
];

const tableEntryArray: any[] = widgetData
  .filter(
    ele =>
      (ele.key === 'applicationWidget' && hasApplicationsAccess) ||
      (ele.key === 'eventsWidget' && hasEventsAccess) ||
      (ele.key === 'platformsWidget' && hasAPlatformAccess) ||
      (ele.key === 'businessMonitoringWidget' && hasBizOpsAccess) ||
      (ele.key === 'incidentsWidget' && !playwithEnabled) ||
      (ele.key === 'websitesWidget' && hasWebsitesAccess) ||
      (ele.key === 'mobileListWidget' && hasMobileAppsAccess) ||
      (ele.key === 'infrastructureWidget' && hasInfrastructureAccess) ||
      (ele.key === 'syntheticWidget' && hasSyntheticsAccess) ||
      (ele.key === 'dashboardWidget' && !playwithEnabled)
  )
  .map((ele, index) => {
    itemIds.push({ id: index.toString() });
    return ele;
  });

interface PageContentProps {
  enableQuickLinkForAgentAndUser: boolean;
}

export default function PageContent({ enableQuickLinkForAgentAndUser }: PageContentProps) {
  return (
    <div className={locals.dashboardTilesWrapper}>
      <QuickLinks enableQuickLinkForAgentAndUser={enableQuickLinkForAgentAndUser} />
      <RenderTable />
    </div>
  );
}

function filterItems(orderedItems: WidgetOrdering[]): WidgetOrdering[] {
  return orderedItems.filter(({ id }: { id: string }) => {
    if (
      (id === '3' && !hasWebsitesAccess) ||
      (id === '4' && !hasMobileAppsAccess) ||
      (id === '6' && !hasApplicationsAccess)
    ) {
      return false;
    }
    return true;
  });
}

function getOrderedItems(settings: UiSettings | null | undefined): WidgetOrdering[] {
  const orderingFromSettings = settings?.[settingsKey];
  if (orderingFromSettings) {
    const result: WidgetOrdering[] = orderingFromSettings.ordering;
    itemIds.forEach(item => {
      if (!result.find((r: WidgetOrdering) => r.id === item.id)) {
        result.push(item);
      }
    });
    return orderingFromSettings.ordering;
  }

  return itemIds;
}

function RenderTable() {
  const storedSettings: UiSettings | null | undefined = useObservable(settings$, []);

  const [internalItemOrder, setItemOrder] = useState(filterItems(getOrderedItems(storedSettings)));

  const setNewItemOrder = (items: WidgetOrdering[]) => {
    setSingle(settingsKey, { ordering: items.map(({ id }: { id: string }, i: number) => ({ id, x: 0, y: i * 10 })) });
    setItemOrder(items);
  };

  return (
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
          <div ref={provided.innerRef} className={locals.draggableItemWrapper}>
            {internalItemOrder.map((_config: WidgetOrdering, index: number) => {
              const ele = tableEntryArray[+_config.id];
              if (!ele) {
                return null;
              }

              const Widget = ele.widget;

              return (
                <Draggable key={_config.id} draggableId={_config.id} index={index}>
                  {provided => {
                    const dashboardTileProps: DashboardTileParamProps = {
                      key: +_config.id,
                      header: ele.label,
                      icon: ele.icon,
                      dragAndDropConfigs: provided.dragHandleProps,
                      sectionLabel: ele.label
                    };
                    return ele?.key === 'eventsWidget' ? (
                      <div id={ele.key} ref={provided.innerRef} {...provided.draggableProps}>
                        <EventsChartWidget {...dashboardTileProps} />
                      </div>
                    ) : (
                      <div id={ele.key} ref={provided.innerRef} {...provided.draggableProps}>
                        {Widget && (
                          <Widget
                            key={ele.key}
                            type={ele.type}
                            widgetLabel={ele.key}
                            dashboardTileProps={dashboardTileProps}
                          />
                        )}
                      </div>
                    );
                  }}
                </Draggable>
              );
            })}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export function getWidget(widgetName: string) {
  return tableEntryArray.find(item => item.key === widgetName) ?? null;
}
