/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { find, isEqual, debounce } from 'lodash';

import { generateUniqueShortId } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import {
  CUSTOM_DASHBOARD_SHARE,
  CUSTOM_DASHBOARD_EDIT_SAVE,
  CUSTOM_DASHBOARD_DELETE,
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
import { dashboardIdUrlParameter, dashboardTopLevelFilterUrlParameter } from 'in-custom-dashboards/navigation/url';
import PdfHeader from 'in-custom-dashboards/CustomDashboard/DownloadPdfDialog/components/PdfHeader/PdfHeader';
import PdfWidgetContainer from 'in-custom-dashboards/CustomDashboard/PdfWidgetContainer/PdfWidgetContainer';
import WidgetEditorDialog from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetEditorDialog';
import { getCustomDashboard, updateCustomDashboard, removeCustomDashboard } from 'in-custom-dashboards/api';
import { sanitizeNode, getPdfHeader } from 'in-custom-dashboards/CustomDashboard/DownloadPdfDialog/utils';
import DownloadPdfDialog from 'in-custom-dashboards/CustomDashboard/DownloadPdfDialog/DownloadPdfDialog';
import ZoomWidgetDialog from 'in-custom-dashboards/CustomDashboard/ZoomWidgetDialog/ZoomWidgetDialog';
import EditAsJsonDialog from 'in-custom-dashboards/CustomDashboard/EditAsJsonDialog/EditAsJsonDialog';
import { CustomDashboardContext } from 'in-custom-dashboards/CustomDashboard/CustomDashboardContext';
import CustomDashboardPresenter from 'in-custom-dashboards/CustomDashboard/CustomDashboardPresenter';
import SharingDialog from 'in-custom-dashboards/CustomDashboard/SharingDialog/SharingDialog';
import { activeDialogs$, addActiveDialog, close } from 'in-components/DialogPresenter/store';
import DuplicateDashboardDialog from 'in-custom-dashboards/DuplicateDashboardDialog';
import { onLayoutChange } from 'in-custom-dashboards/CustomDashboard/editor';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { getWidgetId } from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getTrackingMeta } from 'in-custom-dashboards/tracker';
import { nodeToImage } from 'in-services/util/nodeToImage';
import { imagesToPdf } from 'in-services/util/imagesToPdf';
import { welcomePage } from 'in-plg/navigation/paths';
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

  const [{ dashboardId, tagFilterExpression }, setUrlState] = useUrlState(urlStateDefinition);

  const result = useObservable(getCustomDashboard(dashboardId), [dashboardId]);

  const [config, setConfig] = useState(getInitialState(result).config);
  const [isSaving, setSaving] = useState(getInitialState(result).isSaving);
  const [isReadyToExport, setIsReadyToExport] = useState(false);
  const [exportWidgetId, setExportWidgetId] = useState(null);
  const [shouldExportWidget, setShouldExportWidget] = useState(false);
  const [downloadDashboard, setDownloadDashboard] = useState(false);
  const [tooltipRef, setTooltipRef] = useState(null);
  const pdfWidgetContainerRef = useRef(null);
  const pdfHeader = useRef(null);

  const activeDialogs = useObservable(activeDialogs$, []) ?? [];

  const { location, navigate } = useNavigation();
  const { trackCta } = useSegmentTracking();

  const [topLevelFilters, setTopLevelFilters] = useState(tagFilterExpression ?? []);
  const onTopLevelFiltersChange = useCallback(
    tagFilterExpression => setUrlState({ tagFilterExpression }),
    [setUrlState]
  );
  useEffect(() => setTopLevelFilters(tagFilterExpression), [tagFilterExpression]);

  const exportWidget = exportWidgetId && find(config?.widgets, eachWidget => exportWidgetId === eachWidget.id);

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

  useEffect(() => {
    if (isReadyToExport && shouldExportWidget) {
      const onPDFDownloadDebounce = debounceOnPDFDownload({
        exportWidgetId,
        onPDFDownload,
        setIsReadyToExport,
        setShouldExportWidget,
        tooltipRef
      });

      onPDFDownloadDebounce();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportWidgetId, isReadyToExport, shouldExportWidget, tooltipRef]);

  return (
    <CustomDashboardContext.Provider value={{ setExportWidgetId, setTooltipRef, setShouldExportWidget }}>
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
        onCopyWidget={onCopyWidget}
        onCopyAllWidgets={onCopyAllWidgets}
        onDuplicateWidget={onDuplicateWidget}
        onZoomWidget={onZoomWidget}
        onRemoveWidget={onRemoveWidget}
        onDiscardChanges={onDiscardChanges}
        onPDFDashboardDownload={() => {
          setDownloadDashboard(true);
          trackCta(DOWNLOAD_PDF_START, { customDashboardId: dashboardId });
          onPDFDashboardDownload(dashboardId);
        }}
        onShare={onShare}
        onEditAsJson={onEditAsJson}
        onViewAsJson={onViewAsJson}
        shouldWidgetRenderOutsideViewport={downloadDashboard}
        canCreatePublicCustomDashboards={role.canCreatePublicCustomDashboards}
        topLevelFilters={topLevelFilters}
        onTopLevelFiltersChange={onTopLevelFiltersChange}
      />
      <PdfHeader ref={pdfHeader} />
      {exportWidget && (
        <PdfWidgetContainer widget={exportWidget} ref={pdfWidgetContainerRef} setIsReadyToExport={setIsReadyToExport} />
      )}
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
      <ZoomWidgetDialog
        widget={widget}
        component={Widget}
        close={() => {
          trackCta(CUSTOM_DASHBOARD_ZOOM_WIDGET_FINISH, getTrackingMeta(widget));
          close();
        }}
      />
    );
  }

  function onRemoveWidget(id) {
    const newConfig = deepCopy(config);
    newConfig.widgets = newConfig.widgets.filter(widget => id !== widget.id);
    trackCta(CUSTOM_DASHBOARD_DELETE_WIDGET, getTrackingMeta(config.widgets?.find(widget => id === widget.id)));
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
            const targetLocation = { ...location, pathname: welcomePage };
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

  async function onPDFDownload(id, tooltipRef) {
    const widget = find(config.widgets, eachWidget => id === eachWidget.id);
    const widgetType = widget?.type;
    const widgetNode = document.getElementById(getWidgetId(id));
    const nodeToExport = pdfWidgetContainerRef?.current?.firstChild;
    const header = pdfHeader?.current?.firstChild;
    const orientation = ['chart', 'apdex', 'histogram', 'slo', 'slo2'].includes(widgetType) ? 'l' : 'p';

    if (nodeToExport) {
      if (tooltipRef) {
        handleTooltip({ tooltipRef, nodeToExport, widget: widgetNode, widgetType });
      } else {
        nodeToExport?.querySelector('.tooltip')?.classList?.add('hidden');
      }

      addMessage(
        {
          type: 'info',
          timeout: 4000,
          title: t('in-custom-dashboards:customDashboard.customDashboard.generatingPDFTitle'),
          content: t('in-custom-dashboards:customDashboard.customDashboard.generatingPDFContent')
        },
        'custom-dashboard-pdf-generation'
      );

      const headerUrl = await getPdfHeader({ node: header });
      const imagesUrls = [
        await nodeToImage({
          node: nodeToExport,
          options: {
            filter: node => sanitizeNode(node, widgetType)
          }
        }).finally(() => {
          setExportWidgetId(null);
          setTooltipRef(null);
        })
      ];

      imagesToPdf({
        imageScale: 2,
        imagesUrls,
        headerUrl,
        filename: id,
        shouldFitPdf: true,
        pdfSettings: {
          orientation
        }
      }).then(({ onfulfilled }) => {
        if (onfulfilled) {
          addMessage(
            {
              type: 'info',
              timeout: 5000,
              title: t('in-custom-dashboards:customDashboard.customDashboard.generatedPDFTitle'),
              content: t('in-custom-dashboards:customDashboard.customDashboard.generatedPDFContent')
            },
            'custom-dashboard-pdf-generated'
          );
        }
      });
    }
  }

  function onPDFDashboardDownload(customDashboardId) {
    const node = document.querySelector('.react-grid-layout');
    const header = pdfHeader?.current?.firstChild;

    if (!node) {
      setDownloadDashboard(false);
      return;
    }

    addActiveDialog(
      <DownloadPdfDialog
        customDashboardId={customDashboardId}
        close={() => {
          setDownloadDashboard(false);
          close();
        }}
        node={node}
        header={header}
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

function handleTooltip({ tooltipRef, nodeToExport, widget, widgetType }) {
  const chartOverlaySelector = '.chart-overlay';
  const isHistogram = widgetType === 'histogram';
  const widgetChartOverlay = getElementInRef(widget, chartOverlaySelector);
  const nodeToExportChartOverlay = getElementInRef(nodeToExport, chartOverlaySelector);

  if (!widgetChartOverlay || !nodeToExportChartOverlay) {
    return;
  }

  // Get the scale to position the tooltip in the right place, respecting the proportion.
  const scaleToAdjustTooltipPosition = nodeToExportChartOverlay.offsetWidth / widgetChartOverlay.offsetWidth;

  if (isHistogram) {
    adjustHistogramTooltip(tooltipRef, scaleToAdjustTooltipPosition);
  } else {
    adjustTooltipPosition(tooltipRef, scaleToAdjustTooltipPosition);
  }

  // Append tooltip to nodeToExport chart overlay
  nodeToExportChartOverlay.appendChild(tooltipRef);
}

function debounceOnPDFDownload({
  exportWidgetId,
  onPDFDownload,
  setIsReadyToExport,
  setShouldExportWidget,
  tooltipRef
}) {
  if (!exportWidgetId) {
    return null;
  }
  return debounce(() => {
    onPDFDownload(exportWidgetId, tooltipRef);
    setShouldExportWidget(false);
    setIsReadyToExport(false);
  }, 1000);
}

function adjustTooltipPosition(node, scale) {
  const position = parseFloat(node.style.left);
  if (isNaN(position)) {
    return;
  }

  const adjustedPosition = position * scale;
  node.style.left = `${adjustedPosition}px`;
}

function getElementInRef(ref, query) {
  return ref?.querySelector(query);
}

function adjustHistogramTooltip(tooltipRef, scaleToAdjustTooltipPosition) {
  const [barStrike, tooltipContent] = tooltipRef?.children || [];

  if (barStrike) {
    adjustTooltipPosition(barStrike, scaleToAdjustTooltipPosition);
  }

  if (tooltipContent) {
    adjustTooltipPosition(tooltipContent, scaleToAdjustTooltipPosition);
  }
}
