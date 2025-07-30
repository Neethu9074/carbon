/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';
import { find } from 'lodash';

import { Snapshot as BaseSnapshotItem, Widget, CustomDashboard } from '@instana/types';
import { PreviewPill, Button, Link } from '@instana/components';
import { useObservable } from '@instana/hooks';

//@ts-expect-error TS migration
import WidgetEditorDialog from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetEditorDialog';
//@ts-expect-error TS migration
import getSnapshotIdTagFilter from 'in-infrastructure/Dashboard/components/DashboardHeader';
//@ts-expect-error TS migration
import { customEntitiesDashboard } from 'in-infrastructure/navigation/paths';
//@ts-expect-error TS migration
import { onLayoutChange } from 'in-custom-dashboards/CustomDashboard/editor';
import CustomEntityDashboardPreseter from 'in-infrastructure/CustomEntity/CustomEntityDashboardPresenter';
//@ts-expect-error TS migration
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import { useLinkToExplore as useLinkToCustomEntityExplore } from 'in-infrastructure/navigation/paths';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
//@ts-expect-error TS migration
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { getCustomEntityById, updateCustomEntity } from 'in-infrastructure/CustomEntity/api';
//@ts-expect-error TS migration
import { selectedSnapshot$ } from 'in-stores/snapshot';
import DefaultSidebar from 'in-infrastructure/Dashboard/components/DefaultSidebar';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-components/DashboardHeader';
import { deepCopy } from 'in-services/util/object';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Sticky from 'in-components/Sticky/Sticky';
import { t } from 'in-i18n';

import locals from './CustomEntitiesDashboards.mless';

export interface SnapshotItem extends Omit<BaseSnapshotItem, 'id'> {
  get: (id: string) => string;
  getIn(keys: string[]): any;
  id: string;
}

const dashboardsInfoWidget: Widget = {
  config: t('in-infrastructure:customEntities.dashboardsInfoWidgetDescription'),
  height: 6,
  id: '123',
  title: t('in-infrastructure:customEntities.dashboardsInfoWidgetTitle'),
  type: 'markdown',
  width: 6,
  x: 0,
  y: 0
};

const defaultDashboard: CustomDashboard = {
  accessRules: [],
  id: '1',
  title: t('in-infrastructure:customEntities.defaultDashboard'),
  widgets: [dashboardsInfoWidget]
};

export default function CustomEntitiesDashboardsPage() {
  const { location, createHrefToPath } = useNavigation();
  const getLinkToCustomEntityExplore = useLinkToCustomEntityExplore();
  const customEntityModel = getMatrixParameter(location, customEntitiesDashboard, 'customEntityModel') ?? '';
  const snapshot = useObservable(selectedSnapshot$, []) as SnapshotItem;
  const customEntity = useObservable(getCustomEntityById(customEntityModel), [customEntityModel])?.data?.data;
  // Currently only adding support for single dashboard, in future will add support for multiple
  const customEntityDashboard = customEntity?.dashboards?.[0];
  const [dashboardConfig, setDashboardConfig] = useState(getInitialState(customEntityDashboard).config);
  const [editable, setEditable] = useState(false);

  const customEntityName = customEntity?.label;
  const instanceName = snapshot?.get('label');

  useEffect(() => {
    setDashboardConfig(getInitialState(customEntityDashboard).config);
  }, [customEntityDashboard]);

  if (dashboardConfig == null) {
    setDashboardConfig(getInitialState(defaultDashboard).config);
  }

  if (!snapshot || !customEntity) {
    return null;
  }

  const breadcrumbs = [
    <div className={locals.crumbs} key="breadcrumbs">
      <Link href={createHrefToPath('/physical')}>{t('in-infrastructure:dashboard.map')}</Link>
      <span>/</span>
      <Link href={getLinkToCustomEntityExplore({ customEntityModel: customEntityName, type: 'customEntities' })}>
        {customEntityName}
      </Link>
      <span>/</span>
      <Link> {instanceName} </Link>
    </div>
  ];

  return (
    <>
      <Sticky
        header={
          <>
            <BreadcrumbHeader />
            <Breadcrumbs items={breadcrumbs} />
            <DashboardHeader
              title={t('in-infrastructure:customEntities.labelDashboard')}
              label={
                <>
                  {instanceName}
                  {/* <PreviewPill /> */}
                </>
              }
              renderMetaInformation={() => (
                <div>
                  {customEntity.label}
                  <PreviewPill />
                </div>
              )}
              renderButtonLine={() => (
                <ButtonLine
                  snapshot={snapshot}
                  editable={editable}
                  onSaveDashboard={onSaveDashboard}
                  onDiscardChanges={onDiscardChanges}
                />
              )}
              renderButtonLineSecondary={() => (
                <ButtonLineSecondary
                  editable={editable}
                  onAddWidget={onAddWidget}
                  setEditable={setEditable}
                  customEntityName={customEntityName}
                />
              )}
            />
          </>
        }
      />
      <div className={locals.wrapper}>
        <div className={locals.sidebar}>
          <DefaultSidebar snapshot={snapshot} />
        </div>
        <div className={locals.content}>
          <CustomEntityDashboardPreseter
            dashboardConfig={dashboardConfig}
            onLayoutChange={changes => onLayoutChange(dashboardConfig, setDashboardConfig, changes)}
            onEditWidget={onEditWidget}
          />
        </div>
      </div>
    </>
  );

  function getInitialState(result: any) {
    if (!result) {
      return {
        persistedConfig: null,
        config: null,
        isSaving: false
      };
    }

    return {
      persistedConfig: result,
      config: deepCopy(result),
      isSaving: false
    };
  }

  function onAddWidget() {
    addActiveDialog(
      <WidgetEditorDialog
        onSubmit={(widget: Widget) => {
          let newConfig = deepCopy(dashboardConfig);
          // remove default widget if present
          newConfig.widgets = newConfig.widgets.filter((widget: Widget) => widget.id !== dashboardsInfoWidget.id);
          newConfig.widgets.push(widget);

          setDashboardConfig(newConfig);
        }}
      />
    );
  }

  function onSaveDashboard() {
    const updatedEntity = deepCopy(customEntity);
    if (updatedEntity?.dashboards) {
      updatedEntity.dashboards[0] = dashboardConfig;
      updateCustomEntity(customEntityModel, updatedEntity).subscribe(result => {
        if (result.progress.loading) {
          addMessage(
            {
              type: 'info',
              timeout: 5000,
              content: t('in-infrastructure:customEntities.successfulSaveDashboard')
            },
            'entity-dashboard-save-success'
          );
          return;
        }

        if (result.errors.length > 0) {
          addMessage(
            {
              type: 'danger',
              timeout: 5000,
              content: t('in-infrastructure:customEntities.failSaveDashboard')
            },
            'entity-dashboard-error'
          );
        }
      });
    }
    setEditable(false);
  }

  function onDiscardChanges() {
    setDashboardConfig(customEntityDashboard);
  }

  function onEditWidget(id: string) {
    const widget = find(dashboardConfig.widgets, eachWidget => id === eachWidget.id);
    addActiveDialog(
      <WidgetEditorDialog
        widget={widget}
        onSubmit={(widget: Widget) => {
          let newConfig = deepCopy(dashboardConfig);
          newConfig.widgets = newConfig.widgets.filter((widget: Widget) => widget.id !== id);
          newConfig.widgets.push(widget);

          setDashboardConfig(newConfig);
        }}
      />
    );
  }
}

function ButtonLine({
  snapshot,
  editable,
  onSaveDashboard,
  onDiscardChanges
}: Readonly<{
  snapshot: SnapshotItem;
  editable: boolean;
  onSaveDashboard: () => void;
  onDiscardChanges: () => void;
}>) {
  const timeConfig = useTimeConfig();
  if (editable) {
    return (
      <>
        <Button kind="primary" icon="lib_actions_sync" onClick={onSaveDashboard}>
          {t('in-infrastructure:customEntities.saveChanges')}
        </Button>
        <Button kind="tertiary" icon="lib_actions_discard" onClick={onDiscardChanges}>
          {t('in-infrastructure:customEntities.discardChanges')}
        </Button>
      </>
    );
  }
  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={snapshot.get('id')}
        timeConfig={timeConfig}
      />
      <ContextGuide
        id={snapshot.get('id')}
        timeConfig={timeConfig}
        tagFilters={[]}
        plugin={snapshot.get('plugin')}
        size="normal"
      />
    </>
  );
}

function ButtonLineSecondary({
  editable,
  onAddWidget,
  setEditable,
  customEntityName
}: Readonly<{
  editable: boolean;
  onAddWidget: () => void;
  setEditable: (editable: boolean) => void;
  customEntityName?: string;
}>) {
  if (editable) {
    return (
      <Button kind="action" icon="lib_openclose_add_circle_outline" onClick={onAddWidget}>
        {t('in-infrastructure:customEntities.addWidget')}
      </Button>
    );
  }
  return (
    <Button kind="tertiary" onClick={() => setEditable(true)} icon="lib_actions_edit">
      {t('in-infrastructure:customEntities.editDashboard')}
      {customEntityName}
    </Button>
  );
}
