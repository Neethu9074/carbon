/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { DOWNLOAD_PDF_WIDGET } from 'in-services/tracking/tracking';

interface Props {
  tooltipRef: HTMLElement;
  nodeToExport: HTMLElement;
  widget: HTMLElement;
  isHistogram: boolean;
}

/**
 * When exporting the widget from the chart (clicking with right button and selecting Download PDF),
 * the tooltip needs to be stored and saved, so it can be added to the pdf as well.
 * The functions below handle the position of the tooltip when preparing the node to be exported.
 */
export function handleTooltip({ tooltipRef, nodeToExport, widget, isHistogram }: Props) {
  const chartOverlaySelector = '.chart-overlay';
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

function adjustTooltipPosition(node: HTMLElement, scale: number) {
  const position = parseFloat(node.style.left);
  if (isNaN(position)) {
    return;
  }

  const adjustedPosition = position * scale;
  node.style.left = `${adjustedPosition}px`;
}

function getElementInRef(ref: any, query: string) {
  return ref?.querySelector(query);
}

function adjustHistogramTooltip(tooltipRef: any, scaleToAdjustTooltipPosition: number) {
  const [barStrike, tooltipContent] = tooltipRef?.children || [];

  if (barStrike) {
    adjustTooltipPosition(barStrike, scaleToAdjustTooltipPosition);
  }

  if (tooltipContent) {
    adjustTooltipPosition(tooltipContent, scaleToAdjustTooltipPosition);
  }
}

interface ExportWidgetPdfOptions {
  action: any;
  widgetId: string;
  widgetType: string;
  widgetNode: HTMLElement;
  tooltipRef: any;
  isHistogram: boolean;
  trackCta: CtaTrackingFunction;
}

/**
 * Utility function that will trigger the generation of the pdf in the custom dashboards.
 */
export const exportWidgetAsPdf = ({
  widgetId,
  widgetType,
  widgetNode,
  tooltipRef,
  isHistogram,
  action,
  trackCta
}: ExportWidgetPdfOptions) => {
  const orientation = getWidgetPdfOrientation(widgetType);
  const options = {
    filename: widgetId,
    customize: (nodeToExport: HTMLElement) =>
      customizeTooltip({
        nodeToExport,
        widgetNode,
        tooltipRef,
        isHistogram
      }),
    pdfSettings: { orientation }
  };
  trackCta?.(DOWNLOAD_PDF_WIDGET, { widgetId });
  action?.(options);
};

export function getWidgetPdfOrientation(widgetType: string) {
  return ['chart', 'apdex', 'histogram', 'slo', 'slo2'].includes(widgetType) ? 'l' : 'p';
}

export function customizeTooltip({ nodeToExport, tooltipRef, widgetNode, isHistogram }: any) {
  if (!tooltipRef || !widgetNode) return;
  return handleTooltip({ tooltipRef, nodeToExport, widget: widgetNode, isHistogram });
}

export function getWidgetProperties(element: HTMLElement) {
  const widgetNode = element.closest('[id^="widget-"]') as HTMLElement;
  const widgetId = widgetNode?.id.replace(/^widget-/, '') || '';
  const widgetType = widgetNode?.dataset?.type ?? '';
  return {
    widgetNode,
    widgetId,
    widgetType
  };
}
