/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const widgetsWithLegend = ['chart', 'histogram', 'apdex', 'slo'];
const classes = ['legend-arrow', 'legend-dot', 'legend-label'];

export const sanitizeWidgets = (node: Node, widgetType?: string) => {
  if (node instanceof SVGElement && node.classList.contains('legend-arrow')) {
    return false;
  }

  if (!(node instanceof HTMLElement)) {
    return true;
  }

  const shouldDisplayCaption = widgetType && widgetsWithLegend.includes(widgetType);

  if (shouldDisplayCaption) {
    toggleDisplay(true, classes, node);
  } else {
    // Im some cases, like pie Chart, an additional legend value is added so it can be visible in the pdf.
    if (node.classList.contains('legend-value')) {
      node.style.display = 'block';
    }
    toggleDisplay(false, classes, node);
  }

  // When the caption gets shrinked (i.e, pie chart, time series) and an arrow is displayed.
  // It needs to be forced to be visible in the pdf.
  if (node.classList.contains('legend-container')) {
    node.style.height = 'auto';
  }

  // List of classes to exclude from the image generation
  const elementsToExclude = ['search-input', 'view-full-table', 'show-results', 'legend-arrow', 'hidden'];
  return !elementsToExclude.some(cls => node.classList.contains(cls));
};

const toggleDisplay = (shouldShow: boolean, classes: string[], node: HTMLElement) => {
  classes.forEach(classe => {
    if (node.classList.contains(classe)) {
      node.style.display = shouldShow ? 'block' : 'none';
    }
  });
};
