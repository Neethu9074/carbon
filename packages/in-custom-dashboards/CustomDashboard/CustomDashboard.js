/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { find, isEqual } from 'lodash';

import { generateUniqueShortId } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import {
  CUSTOM_DASHBOARD_SHARE,
  CUSTOM_DASHBOARD_EDIT_SAVE,
  CUSTOM_DASHBOARD_DELETE,
  CUSTOM_DASHBOARD_EIDT_TEAMS,
  CUSTOM_DASHBOARD_ADD_WIDGET_START,
  CUSTOM_DASHBOARD_ADD_WIDGET_FINISH,
  CUSTOM_DASHBOARD_EDIT_WIDGET_START,
  CUSTOM_DASHBOARD_EDIT_WIDGET_FINISH,
  CUSTOM_DASHBOARD_DELETE_WIDGET,
  CUSTOM_DASHBOARD_ZOOM_WIDGET_START,
  CUSTOM_DASHBOARD_ZOOM_WIDGET_FINISH,
  CUSTOM_DASHBOARD_ADD_WIDGET_DUPLICATE,
  DOWNLOAD_PDF_START
} from 'in-services/tracking/tracking';
import {
  customDashboardsPath,
  dashboardIdUrlParameter,
  dashboardTopLevelFilterUrlParameter
} from 'in-custom-dashboards/navigation/url';
import PdfWidgetContainer from 'in-custom-dashboards/CustomDashboard/DownloadPdf/components/PdfWidgetContainer/PdfWidgetContainer';
import { exportWidgetAsPdf, getWidgetProperties } from 'in-custom-dashboards/CustomDashboard/DownloadPdf/utils';
import WidgetEditorDialog from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetEditorDialog';
import { getCustomDashboard, updateCustomDashboard, removeCustomDashboard } from 'in-custom-dashboards/api';
import { sanitizeWidgets } from 'in-custom-dashboards/CustomDashboard/DownloadPdf/sanitize/sanitizeWidgets';
import ZoomWidgetDialog from 'in-custom-dashboards/CustomDashboard/ZoomWidgetDialog/ZoomWidgetDialog';
import EditAsJsonDialog from 'in-custom-dashboards/CustomDashboard/EditAsJsonDialog/EditAsJsonDialog';
import { CustomDashboardContext } from 'in-custom-dashboards/CustomDashboard/CustomDashboardContext';
import CustomDashboardPresenter from 'in-custom-dashboards/CustomDashboard/CustomDashboardPresenter';
import EditTeamsDialog from 'in-custom-dashboards/CustomDashboard/EditTeamsDialog/EditTeamsDialog';
import { FilterContext } from 'in-custom-dashboards/CustomDashboard/FilterContext/FilterContext';
import DownloadPdfDialog from 'in-components/DownloadPdf/DownloadPdfDialog/DownloadPdfDialog';
import SharingDialog from 'in-custom-dashboards/CustomDashboard/SharingDialog/SharingDialog';
import { activeDialogs$, addActiveDialog, close } from 'in-components/DialogPresenter/store';
import DuplicateDashboardDialog from 'in-custom-dashboards/DuplicateDashboardDialog';
import { onLayoutChange } from 'in-custom-dashboards/CustomDashboard/editor';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { getWidgetId } from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import usePdfExport from 'in-components/DownloadPdf/hooks/usePdfExport';
import { getTrackingMeta } from 'in-custom-dashboards/tracker';
import widgets from 'in-custom-dashboards/widgets';
import { deepCopy } from 'in-services/util/object';
import Prompt from 'in-components/Dialog/Prompt';
import useUrlState from 'in-hooks/useUrlState';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

export default function CustomDashboardLoader(props) {
  const urlStateDefinition = {
    bind: [dashboardIdUrlParameter, dashboardTopLevelFilterUrlParameter],
    replaceHistory: false
  };

  const { generatePdfFromElement, getPdfHeaderUrl, PdfExportRenderer } = usePdfExport();
  const [{ dashboardId, tagFilterExpression }, setUrlState] = useUrlState(urlStateDefinition);
  const result = useObservable(getCustomDashboard(dashboardId), [dashboardId]);

  const [config, setConfig] = useState(getInitialState(result).config);
  const [isSaving, setSaving] = useState(getInitialState(result).isSaving);
  const [downloadDashboard, setDownloadDashboard] = useState(false);
  const activeDialogs = useObservable(activeDialogs$, []) ?? [];

  const { location, navigate } = useNavigation();
  const { trackCta } = useSegmentTracking();

  const [topLevelFilters, setTopLevelFilters] = useState(tagFilterExpression ?? []);
  const onTopLevelFiltersChange = useCallback(
    tagFilterExpression => setUrlState({ tagFilterExpression }),
    [setUrlState]
  );
  useEffect(() => setTopLevelFilters(tagFilterExpression), [tagFilterExpression]);

  useEffect(() => {
    setConfig(getInitialState(result).config);
    setSaving(getInitialState(result).isSaving);
  }, [result]);

  useEffect(() => {
    const handlePasteAnywhere = event => {
      if (activeDialogs.length === 0) {
        const input = JSON.parse(event.clipboardData.getData('text'));
        const newConfig = deepCopy(config);
        const widgets = Array.isArray(input) ? input : [input];
        widgets.forEach(widget => {
          input.id = generateUniqueShortId();
          newConfig.widgets.push(widget);
        });
        setConfig(newConfig);
      }
    };

    window.addEventListener('paste', handlePasteAnywhere);

    return () => {
      window.removeEventListener('paste', handlePasteAnywhere);
    };
  }, [config, activeDialogs.length]);

  const exportWidgetToPdf = useCallback(
    ({ target, tooltipRef, isHistogram, pdfHeaderTitle }) => {
      const { widgetNode, widgetType, widgetId } = getWidgetProperties(target);
      return exportWidgetAsPdf({
        action: options => generatePdfFromElement(<PdfWidgetContainer widgetId={widgetId} />, options),
        widgetNode,
        widgetId,
        widgetType,
        pdfHeaderTitle,
        tooltipRef,
        isHistogram,
        trackCta
      });
    },
    [generatePdfFromElement, trackCta]
  );

  const contextValues = useMemo(
    () => ({ widgets: config?.widgets, exportWidgetToPdf, customDashboardTitle: config?.title }),
    [config, exportWidgetToPdf]
  );
  return (
    <CustomDashboardContext.Provider value={contextValues}>
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
        onEditTeams={onEditTeams}
        onDuplicateDashboard={onDuplicateDashboard}
        onAddWidget={onAddWidget}
        onEditWidget={onEditWidget}
        onCopyWidget={onCopyWidget}
        onCopyAllWidgets={onCopyAllWidgets}
        onDuplicateWidget={onDuplicateWidget}
        onZoomWidget={onZoomWidget}
        onRemoveWidget={onRemoveWidget}
        onDiscardChanges={onDiscardChanges}
        onPDFDownload={widgetConfig => onPDFDownload(widgetConfig, config)}
        onPDFDashboardDownload={() => {
          setDownloadDashboard(true);
          trackCta(DOWNLOAD_PDF_START, { customDashboardId: dashboardId, dashboardTitle: config.title });
          onPDFDashboardDownload(config);
        }}
        onShare={onShare}
        onEditAsJson={onEditAsJson}
        onViewAsJson={onViewAsJson}
        shouldWidgetRenderOutsideViewport={downloadDashboard}
        canCreatePublicCustomDashboards={role.canCreatePublicCustomDashboards}
        topLevelFilters={topLevelFilters}
        onTopLevelFiltersChange={onTopLevelFiltersChange}
      />
      {PdfExportRenderer}
    </CustomDashboardContext.Provider>
  );

  function onAddWidget() {
    trackCta(CUSTOM_DASHBOARD_ADD_WIDGET_START);
    addActiveDialog(
      <WidgetEditorDialog
        onSubmit={widget => {
          const newConfig = deepCopy(config);
          newConfig.widgets.push(widget);
          trackCta(CUSTOM_DASHBOARD_ADD_WIDGET_FINISH, getTrackingMeta(widget));
          setConfig(newConfig);
        }}
      />
    );
  }

  function onEditWidget(id) {
    const widget = find(config.widgets, eachWidget => id === eachWidget.id);
    trackCta(CUSTOM_DASHBOARD_EDIT_WIDGET_START, getTrackingMeta(widget));
    addActiveDialog(
      <FilterContext.Provider value={topLevelFilters}>
        <WidgetEditorDialog
          widget={widget}
          onSubmit={widget => {
            const newConfig = deepCopy(config);
            newConfig.widgets = newConfig.widgets.filter(widget => widget.id !== id);
            newConfig.widgets.push(widget);
            trackCta(CUSTOM_DASHBOARD_EDIT_WIDGET_FINISH, getTrackingMeta(widget));
            setConfig(newConfig);
          }}
        />
      </FilterContext.Provider>
    );
  }

  function onCopyWidget(id) {
    return JSON.stringify(find(config.widgets, eachWidget => id === eachWidget.id));
  }

  function onCopyAllWidgets() {
    return JSON.stringify(config.widgets);
  }

  function onDuplicateWidget(id) {
    const newConfig = deepCopy(config);
    const widget = deepCopy(find(newConfig.widgets, eachWidget => id === eachWidget.id));
    trackCta(CUSTOM_DASHBOARD_ADD_WIDGET_DUPLICATE, getTrackingMeta(widget));
    widget.id = generateUniqueShortId();
    newConfig.widgets.push(widget);
    setConfig(newConfig);
  }

  function onZoomWidget(id) {
    const widget = find(config.widgets, eachWidget => id === eachWidget.id);
    const { Widget } = widgets[widget.type];
    trackCta(CUSTOM_DASHBOARD_ZOOM_WIDGET_START, getTrackingMeta(widget));
    addActiveDialog(
      <FilterContext.Provider value={topLevelFilters}>
        <ZoomWidgetDialog
          widget={widget}
          component={Widget}
          close={() => {
            trackCta(CUSTOM_DASHBOARD_ZOOM_WIDGET_FINISH, getTrackingMeta(widget));
            close();
          }}
        />
      </FilterContext.Provider>
    );
  }

  function onRemoveWidget(id) {
    const newConfig = deepCopy(config);
    newConfig.widgets = newConfig.widgets.filter(widget => id !== widget.id);
    trackCta(CUSTOM_DASHBOARD_DELETE_WIDGET, getTrackingMeta(config.widgets?.find(widget => id === widget.id)));
    setConfig(newConfig);
  }

  function onEditTeams() {
    trackCta(CUSTOM_DASHBOARD_EIDT_TEAMS);
    addActiveDialog(<EditTeamsDialog config={config} onSubmit={setConfig} />);
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
          trackCta(CUSTOM_DASHBOARD_SHARE, { title: config.title });
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
          trackCta(CUSTOM_DASHBOARD_DELETE, { title: config.title });
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
            const targetLocation = { ...location, pathname: customDashboardsPath };
            navigate(targetLocation);
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
    trackCta(CUSTOM_DASHBOARD_EDIT_SAVE, { title: config.title });
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

  function onPDFDownload(config, dashboardConfig) {
    const { title } = dashboardConfig;
    const target = document.getElementById(getWidgetId(config.id));
    exportWidgetToPdf({ target, tooltipRef: null, isHistogram: false, pdfHeaderTitle: title });
  }

  async function onPDFDashboardDownload(config) {
    const { id, title } = config;

    const node = document.querySelector('.react-grid-layout');
    const pdfHeaderUrl = await getPdfHeaderUrl({ pdfHeaderTitle: title });

    if (!node) {
      setDownloadDashboard(false);
      return;
    }

    addActiveDialog(
      <DownloadPdfDialog
        id={id}
        filename={title}
        headerUrl={pdfHeaderUrl}
        node={node}
        sanitize={sanitizeWidgets}
        close={() => {
          setDownloadDashboard(false);
          close();
        }}
      />
    );
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
