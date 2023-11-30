/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { find, isEqual } from 'lodash';

import { generateUniqueShortId } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import {
  editDashboard,
  shareDashboard,
  deleteDashboard,
  startAddWidget,
  finishAddWidget,
  startEditWidget,
  finishEditWidget,
  deleteWidget,
  startFullScreenWidget,
  finishFullScreenWidget,
  duplicateWidget
} from 'in-custom-dashboards/tracker';
import WidgetEditorDialog from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetEditorDialog';
import { getCustomDashboard, updateCustomDashboard, removeCustomDashboard } from 'in-custom-dashboards/api';
import { dashboardIdUrlParameter, goToCustomDashboardList } from 'in-custom-dashboards/navigation/url';
import EditAsJsonDialog from 'in-custom-dashboards/CustomDashboard/EditAsJsonDialog/EditAsJsonDialog';
import CustomDashboardPresenter from 'in-custom-dashboards/CustomDashboard/CustomDashboardPresenter';
import SharingDialog from 'in-custom-dashboards/CustomDashboard/SharingDialog/SharingDialog';
import DuplicateDashboardDialog from 'in-custom-dashboards/DuplicateDashboardDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { onLayoutChange } from 'in-custom-dashboards/CustomDashboard/editor';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { getWidgetId } from 'in-custom-dashboards/CustomDashboard/Grid';
import { deepCopy } from 'in-services/util/object';
import Prompt from 'in-components/Dialog/Prompt';
import useUrlState from 'in-hooks/useUrlState';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

export default function CustomDashboardLoader(props) {
  const urlStateDefinition = {
    bind: [dashboardIdUrlParameter]
  };

  const [{ dashboardId }, setUrlState] = useUrlState(urlStateDefinition);
  const result = useObservable(getCustomDashboard(dashboardId), [dashboardId]);

  const [config, setConfig] = useState(getInitialState(result).config);
  const [isSaving, setSaving] = useState(getInitialState(result).isSaving);
  useEffect(() => {
    setConfig(getInitialState(result).config);
    setSaving(getInitialState(result).isSaving);
  }, [result]);

  return (
    <CustomDashboardPresenter
      {...props}
      result={result}
      config={config}
      setConfig={setConfig}
      setUrlState={setUrlState}
      // Reset state when the config changes
      key={dashboardId}
      customDashboardId={dashboardId}
      editable={config?.writable && !isSaving}
      hasChanges={hasChanges(result, config)}
      isSaving={isSaving}
      onLayoutChange={changes => onLayoutChange(config, setConfig, changes)}
      onDeleteCustomDashboard={onDeleteCustomDashboard}
      onSaveConfiguration={onSaveConfiguration}
      onRenameDashboard={() => onRenameDashboard(config, setConfig)}
      onDuplicateDashboard={onDuplicateDashboard}
      onAddWidget={onAddWidget}
      onEditWidget={onEditWidget}
      onDuplicateWidget={onDuplicateWidget}
      onFullScreenWidget={onFullScreenWidget}
      onExitFullScreenWidget={onExitFullScreenWidget}
      onRemoveWidget={onRemoveWidget}
      onDiscardChanges={onDiscardChanges}
      onShare={onShare}
      onEditAsJson={onEditAsJson}
      onViewAsJson={onViewAsJson}
      canCreatePublicCustomDashboards={role.canCreatePublicCustomDashboards}
    />
  );

  function onAddWidget() {
    startAddWidget();
    addActiveDialog(
      <WidgetEditorDialog
        onSubmit={widget => {
          const newConfig = deepCopy(config);
          newConfig.widgets.push(widget);
          finishAddWidget(widget);
          setConfig(newConfig);
        }}
      />
    );
  }

  function onEditWidget(id) {
    const widget = find(config.widgets, eachWidget => id === eachWidget.id);
    startEditWidget(widget);
    addActiveDialog(
      <WidgetEditorDialog
        widget={widget}
        onSubmit={widget => {
          const newConfig = deepCopy(config);
          newConfig.widgets = newConfig.widgets.filter(widget => widget.id !== id);
          newConfig.widgets.push(widget);
          finishEditWidget(widget);
          setConfig(newConfig);
        }}
      />
    );
  }

  function onDuplicateWidget(id) {
    const newConfig = deepCopy(config);
    const widget = deepCopy(find(newConfig.widgets, eachWidget => id === eachWidget.id));
    duplicateWidget(widget);
    widget.id = generateUniqueShortId();
    newConfig.widgets.push(widget);
    setConfig(newConfig);
  }

  function onFullScreenWidget(id) {
    const widget = find(config.widgets, eachWidget => id === eachWidget.id);
    const fullscreen = document.querySelector(`#${getWidgetId(widget.id)}`);

    startFullScreenWidget(widget);

    if (!document.fullscreenElement) {
      fullscreen?.requestFullscreen();
    }
  }

  function onExitFullScreenWidget(id) {
    const widget = find(config.widgets, eachWidget => id === eachWidget.id);

    finishFullScreenWidget(widget);

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  function onRemoveWidget(id) {
    const newConfig = deepCopy(config);
    newConfig.widgets = newConfig.widgets.filter(widget => id !== widget.id);
    deleteWidget(config.widgets?.find(widget => id === widget.id));
    setConfig(newConfig);
  }

  function onEditAsJson() {
    addActiveDialog(<EditAsJsonDialog config={config} onSubmit={setConfig} />);
  }

  function onViewAsJson() {
    addActiveDialog(<EditAsJsonDialog config={config} onSubmit={setConfig} readOnly />);
  }

  function onShare() {
    addActiveDialog(
      <SharingDialog
        config={config}
        onSubmit={accessRules => {
          const newConfig = deepCopy(config);
          newConfig.accessRules = accessRules;
          shareDashboard(config.title);
          setConfig(newConfig);
        }}
      />
    );
  }

  function onDeleteCustomDashboard() {
    addActiveDialog(
      <ConfirmationDialog
        header={t('in-custom-dashboards:customDashboard.customDashboard.confirmDashboardDel')}
        headerIcon="lib_views_grid"
        confirmButtonLabel={t('in-custom-dashboards:customDashboard.customDashboard.delDashboard')}
        description={
          <span>
            <Trans
              i18nKey="in-custom-dashboards:customDashboard.customDashboard.uWantDelDashboardConfig"
              values={{ title: config.title }}
              components={{ italic: <i />, bold: <strong /> }}
            />
          </span>
        }
        onSubmit={() => {
          deleteDashboard(config.title);
          close();
          removeCustomDashboard(config.id).subscribe(result => {
            if (result.progress.loading) {
              return;
            }

            if (result.errors.length > 0) {
              addMessage(
                {
                  type: 'danger',
                  timeout: 3000,
                  content: t('in-custom-dashboards:customDashboard.customDashboard.failDelDashboard')
                },
                'custom-dashboard-error'
              );
              return;
            }

            goToCustomDashboardList();
          });
        }}
      />
    );
  }

  function onRenameDashboard(config, setConfig) {
    addActiveDialog(
      <Prompt
        header={t('in-custom-dashboards:customDashboard.customDashboard.renameDashboard')}
        headerIcon="lib_views_grid"
        inputLabel={t('in-custom-dashboards:customDashboard.customDashboard.dashboardName')}
        confirmButtonLabel={t('in-custom-dashboards:customDashboard.customDashboard.rename')}
        initialValue={config.title}
        onSubmit={title => {
          const newConfig = deepCopy(config);
          newConfig.title = title;
          setConfig(newConfig);
          close();
        }}
      />
    );
  }

  function onDuplicateDashboard() {
    addActiveDialog(<DuplicateDashboardDialog config={config} />);
  }

  function onSaveConfiguration() {
    setSaving(true);
    editDashboard(config.title);
    updateCustomDashboard(config).subscribe(result => {
      if (result.progress.loading) {
        return;
      }

      if (result.errors.length > 0) {
        addMessage(
          {
            type: 'danger',
            timeout: 5000,
            content: t('in-custom-dashboards:customDashboard.customDashboard.failSaveDashboard')
          },
          'custom-dashboard-error'
        );
        return;
      }
    });
  }

  function onDiscardChanges() {
    setConfig(deepCopy(result.data));
  }
}

function getInitialState(result) {
  if (!result || !result.data) {
    return {
      persistedConfig: null,
      config: null,
      isSaving: false
    };
  }

  return {
    persistedConfig: result.data,
    config: deepCopy(result.data),
    isSaving: false
  };
}

function hasChanges(result, config) {
  if (!config || !result?.data) {
    return false;
  }

  return !isEqual(result.data, config);
}
