/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import React, { useEffect, ReactNode, useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  hasWebsitesAccess,
  hasMobileAppsAccess,
  hasApplicationsAccess,
  hasAPlatformAccess,
  hasBizOpsAccess,
  hasInfrastructureAccess,
  hasSyntheticsAccess,
  hasEventsAccess,
  hasSloAccess
} from 'in-stores/permission';
import WebsitesAndMobileListWidget from 'in-plg/pages/WelcomePage/widgets/WebsitesAndMobileListWidget';
import SyntheticMonitoringWidget from 'in-plg/pages/WelcomePage/widgets/SyntheticMonitoringWidget';
import BusinessMonitoringWidget from 'in-plg/pages/WelcomePage/widgets/BusinessMonitoringWidget';
import InfrastructureWidget from 'in-plg/pages/WelcomePage/widgets/InfrastructureWidget';
import ServiceLevelsWidget from 'in-plg/pages/WelcomePage/widgets/ServiceLevelsWidget';
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
  toggles?: ReactNode;
  toggleCallback?: (index: number) => void;
  sectionLabel?: string;
}

const syntheticArray = [
  { value: 'test', label: 'Tests' },
  { value: 'location', label: 'Locations' },
  { value: 'smartalerts', label: 'Smart alerts' }
];

const syntheticToogleArray: string[] = syntheticArray.map(ele => ele.label);

interface SortableItemProps {
  id: string;
  content: React.ReactNode;
}

function SortableItem({ id, content }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });

  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : {};

  const style = {
    ...transformStyle,
    zIndex: isDragging ? 1000 : 'auto'
  };

  return (
    <div id={id} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {content}
    </div>
  );
}

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
    label: t('in-plg:welcomepage.component.platformWidget.platforms'),
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
  },
  {
    key: 'serviceLevelsWidget',
    label: t('in-plg:welcomepage.component.serviceLevelsWidget.label'),
    icon: 'lib_actions_reorder',
    widget: ServiceLevelsWidget
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
      (ele.key === 'dashboardWidget' && !playwithEnabled) ||
      (ele.key === 'serviceLevelsWidget' && hasSloAccess)
  )
  .map(ele => {
    itemIds.push({ id: ele.key });
    return ele;
  });

export default function PageContent() {
  return (
    <div className={locals.dashboardTilesWrapper}>
      <QuickLinks />
      <RenderTable />
    </div>
  );
}

function filterItems(orderedItems: WidgetOrdering[]): WidgetOrdering[] {
  return orderedItems.filter(({ id }: { id: string }) => {
    if (
      (id === 'incidentsWidget' && playwithEnabled) ||
      (id === 'dashboardWidget' && playwithEnabled) ||
      (id === 'websitesWidget' && !hasWebsitesAccess) ||
      (id === 'mobileListWidget' && !hasMobileAppsAccess) ||
      (id === 'businessMonitoringWidget' && !hasBizOpsAccess) ||
      (id === 'applicationWidget' && !hasApplicationsAccess) ||
      (id === 'platformsWidget' && !hasAPlatformAccess) ||
      (id === 'infrastructureWidget' && !hasInfrastructureAccess) ||
      (id === 'syntheticWidget' && !hasSyntheticsAccess) ||
      (id === 'eventsWidget' && !hasEventsAccess) ||
      (id === 'serviceLevelsWidget' && !hasSloAccess)
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
  const getOrdered = useMemo(() => getOrderedItems(storedSettings), [storedSettings]);

  const itemOrder = useMemo(() => {
    return filterItems(getOrdered);
  }, [getOrdered]);

  const [internalItemOrder, setItemOrder] = useState<WidgetOrdering[]>(itemOrder);

  useEffect(() => {
    setItemOrder(itemOrder);
  }, [itemOrder]);

  const setNewItemOrder = (items: WidgetOrdering[]) => {
    setSingle(settingsKey, { ordering: items.map(({ id }: { id: string }, i: number) => ({ id, x: 0, y: i * 10 })) });
    setItemOrder(items);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );

  const onDragEnd = ({ active, over }: any) => {
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = internalItemOrder.findIndex(item => item.id === active.id);
    const newIndex = internalItemOrder.findIndex(item => item.id === over.id);

    setNewItemOrder(arrayMove(internalItemOrder, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      autoScroll={{ acceleration: 50 }}
    >
      <SortableContext items={internalItemOrder} strategy={verticalListSortingStrategy}>
        <div className={locals.draggableItemWrapper}>
          {internalItemOrder.map((_config: WidgetOrdering) => {
            const ele = tableEntryArray.find(item => item.key == _config.id);
            if (!ele) {
              return null;
            }

            const Widget = ele.widget;
            let content;

            const dashboardTileProps: DashboardTileParamProps = {
              key: +_config.id,
              header: ele.label,
              icon: ele.icon,
              sectionLabel: ele.label
            };

            if (ele?.key === 'eventsWidget') {
              content = <EventsChartWidget {...dashboardTileProps} />;
            } else {
              content = (
                <Widget key={ele.key} type={ele.type} widgetLabel={ele.key} dashboardTileProps={dashboardTileProps} />
              );
            }

            return <SortableItem id={_config.id} content={content} key={_config.id} />;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export function getWidget(widgetName: string) {
  return tableEntryArray.find(item => item.key === widgetName) ?? null;
}
