/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { DragDropContext, Draggable, DraggableProvidedDragHandleProps, Droppable } from 'react-beautiful-dnd';
import React, { useState } from 'react';

import { DashboardTile, Link } from '@instana/components';
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
  hasEventsAccess,
  hasAPlatformAccess,
  hasBizOpsAccess,
  hasInfrastructureAccess
} from 'in-stores/permission';
// @ts-expect-error file needs to be converted
import ChartWidget from 'in-custom-dashboards/widgets/Chart/Widget';
import WebsitesAndMobileListWidget from 'in-plg/pages/WelcomePage/widgets/WebsitesAndMobileListWidget';
import BusinessMonitoringWidget from 'in-plg/pages/WelcomePage/widgets/BusinessMonitoringWidget';
import InfrastructureWidget from 'in-plg/pages/WelcomePage/widgets/InfrastructureWidget';
import ApplicationWidget from 'in-plg/pages/WelcomePage/widgets/ApplicationWidget';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import IncidentsWidget from 'in-plg/pages/WelcomePage/widgets/IncidentsWidget';
import PlatformWidget from 'in-plg/pages/WelcomePage/widgets/PlatformWidget';
import { carbonAlert, outlineForColor } from 'in-themes/chartColors';
import { setSingle, settings$ } from 'in-services/settings/settings';
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

type tableEntry = {
  key?: string;
  label: string;
  icon?: string;
  widget?: React.FunctionComponent<{
    type?: string | undefined;
    infraType?: string;
    widgetLabel?: string;
    syntheticType?: string;
    dashboardTileProps?: dashboardTileParamProps;
  }>;
  type?: string;
  toogles?: string[];
  infraType?: string;
  syntheticType?: string;
  config?: string;
};

export interface dashboardTileParamProps {
  key: number;
  header: string;
  icon?: string;
  dragAndDropConfigs?: DraggableProvidedDragHandleProps;
  toggles?: string[];
  toggleCallback?: (index: number) => void;
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

const infrastructureArray = [
  { value: 'host', label: 'Hosts' },
  { value: 'docker', label: 'Containers' },
  { value: 'process', label: 'Processes' }
];

const infrastructureToogleArray: string[] = infrastructureArray.map(ele => ele.label);

const widgetData = [
  {
    key: 'applicationWidget',
    label: t('in-plg:welcomepage.component.applicationWidget.label'),
    icon: 'lib_actions_reorder',
    widget: ApplicationWidget
  },
  {
    key: 'eventsWidget',
    label: t('in-plg:welcomepage.component.eventWidget.label'),
    icon: 'lib_actions_reorder'
  },
  {
    key: 'platformsWidget',
    label: getPlatformsTitle(),
    icon: 'lib_actions_reorder',
    widget: PlatformWidget
  },
  {
    key: 'businessMonitoringWidget',
    label: t('in-plg:welcomepage.component.bizopsWidget.label'),
    icon: 'lib_actions_reorder',
    widget: BusinessMonitoringWidget
  },
  {
    key: 'incidentsWidget',
    label: t('in-plg:welcomepage.component.incidentsWidget.label'),
    icon: 'lib_actions_reorder',
    widget: IncidentsWidget
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
    key: 'infrastructureWidget',
    label: t('in-plg:welcomepage.component.infrastructureWidget.label'),
    toogles: infrastructureToogleArray,
    infraType: 'host',
    widget: InfrastructureWidget,
    type: 'infrastructure'
  }
];

const tableEntryArray: tableEntry[] = widgetData
  .filter(
    ele =>
      (ele.key === 'applicationWidget' && hasApplicationsAccess) ||
      (ele.key === 'events' && hasEventsAccess) ||
      (ele.key === 'platformsWidget' && hasAPlatformAccess) ||
      (ele.key === 'businessMonitoringWidget' && hasBizOpsAccess) ||
      ele.key === 'incidentsWidget' ||
      (ele.key === 'websitesWidget' && hasWebsitesAccess) ||
      (ele.key === 'mobileListWidget' && hasMobileAppsAccess) ||
      (ele.key === 'infrastructureWidget' && hasInfrastructureAccess)
  )
  .map((ele, index) => {
    itemIds.push({ id: index.toString() });
    return ele;
  });

export default function PageContent() {
  return (
    <div className={locals.dashboardTilesWrapper}>
      <RenderTable />
    </div>
  );
}

function filterItems(orderedItems: WidgetOrdering[]): WidgetOrdering[] {
  return orderedItems.filter(({ id }: { id: string }) => {
    if (id === '1' && !hasWebsitesAccess && !hasMobileAppsAccess) {
      return false;
    } else if (id === '2' && !hasApplicationsAccess) {
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
                    const dashboardTileProps: dashboardTileParamProps = {
                      key: +_config.id,
                      header: ele.label,
                      icon: ele.icon,
                      dragAndDropConfigs: provided.dragHandleProps
                    };

                    return ele?.label == t('in-plg:welcomepage.component.eventWidget.label') ? (
                      <div id={_config.id} ref={provided.innerRef} {...provided.draggableProps}>
                        <RenderEvents dashboardTileProps={dashboardTileProps} />
                      </div>
                    ) : (
                      <div id={_config.id} ref={provided.innerRef} {...provided.draggableProps}>
                        {Widget && (
                          <Widget type={ele.type} widgetLabel={ele.key} dashboardTileProps={dashboardTileProps} />
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

function RenderEvents({ dashboardTileProps }: { dashboardTileProps: dashboardTileParamProps }) {
  const EventsfullListViewHref = useObservable(getEventsViewFilteredBy({}), []);

  return (
    <DashboardTile
      {...dashboardTileProps}
      rightHeaderContent={
        EventsfullListViewHref && <Link href={EventsfullListViewHref}>{t('in-plg:welcomepage.viewAll')}</Link>
      }
    >
      <div className={locals.dashboardTilesWrapper}>
        <ChartWidget
          config={{
            y1: {
              colors: [carbonAlert.orange40, carbonAlert.red60, carbonAlert.yellow30],
              outlineForColor: outlineForColor,
              formatter: 'number.compact',
              renderer: 'stackedBar',
              metrics: [
                {
                  dynamicFocusQuery: 'event.type:incident ',
                  metric: 'eventCount',
                  timeShift: 0,
                  aggregation: 'DISTINCT_COUNT',
                  label: t('in-plg:welcomepage.component.eventWidget.incidents'),
                  source: 'EVENT'
                },
                {
                  dynamicFocusQuery: 'event.severity:10 event.type:issue ',
                  metric: 'eventCount',
                  timeShift: 0,
                  aggregation: 'DISTINCT_COUNT',
                  label: t('in-plg:welcomepage.component.eventWidget.critical'),
                  source: 'EVENT'
                },
                {
                  dynamicFocusQuery: 'event.severity:5 event.type:issue ',
                  metric: 'eventCount',
                  timeShift: 0,
                  aggregation: 'DISTINCT_COUNT',
                  label: t('in-plg:welcomepage.component.eventWidget.warning'),
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
                label: t('in-plg:welcomepage.component.eventWidget.viewEvents'),
                getHref$: (highlightedTime: any) =>
                  getEventsViewFilteredBy({
                    timeConfig: highlightedTime
                  })
              }
            ]
          }}
          customHeight={250}
        />
      </div>
    </DashboardTile>
  );
}
