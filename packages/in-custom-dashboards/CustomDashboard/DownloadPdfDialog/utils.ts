/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ActionsTypes, PdfAction } from 'in-custom-dashboards/CustomDashboard/DownloadPdfDialog/reducer';
import { nodeToImage } from 'in-services/util/nodeToImage';
import { t } from 'in-i18n';

const widgetsWithLegend = ['chart', 'histogram', 'apdex', 'slo'];
const widgetsWithMinHeight = ['slo', 'slo2', 'apdex', 'chart', 'pie'];

// Function to sanitize and apply changes to nodes.
// It transforms the images placed in the pdf.
export const sanitizeNode = (node: Node, widgetType?: string, rootNode?: HTMLElement) => {
  // In some cases, the rootNode needs to have a full height.
  if (rootNode && widgetType && !widgetsWithMinHeight.includes(widgetType)) {
    rootNode.style.height = 'auto';
  }

  // Won't display the legend-arrow when available
  if (node instanceof SVGElement && node.classList.contains('legend-arrow')) {
    return false;
  }

  if (!(node instanceof HTMLElement)) {
    return true;
  }

  const shouldDisplayCaption = widgetType && widgetsWithLegend.includes(widgetType);
  const classes = ['legend-arrow', 'legend-dot', 'legend-label'];

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

  // Strip out href from <a> tags
  if (node.tagName === 'A') {
    node.setAttribute('href', '#');
  }

  // List of classes to exclude from the image generation
  const elementsToExclude = ['search-input', 'view-full-table', 'show-results', 'legend-arrow', 'hidden'];
  return !elementsToExclude.some(cls => node.classList.contains(cls));
};

export async function generateImagesFromNodes(
  nodes: HTMLElement[],
  setIsGenerating: ActionsTypes,
  dispatch: React.Dispatch<PdfAction>
) {
  const images = [];
  const generateImage = async (node: HTMLElement, nodeType?: string) =>
    await nodeToImage({
      node,
      options: {
        filter: childNode => sanitizeNode(childNode, nodeType, node)
      }
    });

  for (let [i, node] of nodes.entries()) {
    try {
      const image = await generateImage(node, node.dataset.type);
      dispatch({
        type: setIsGenerating,
        payload: {
          value: true,
          text: t('in-custom-dashboards:customDashboard.downloadPdfDialog.loadingWidget', {
            widgetIndex: i + 1,
            totalNodes: nodes.length
          })
        }
      });

      images.push(image);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  return images;
}

// Function that will dispatch the generation of the pdf header.
// It will convert the node to an image and the imageUrl can be retrieved or a dispatch function can be provided.
export async function getPdfHeader({ node, dispatch }: any) {
  return await nodeToImage({
    node,
    format: 'jpeg',
    options: {
      bgcolor: 'white'
    }
  }).then(headerUrl => (dispatch ? dispatch(headerUrl) : headerUrl));
}

const toggleDisplay = (shouldShow: boolean, classes: string[], node: HTMLElement) => {
  classes.forEach(classe => {
    if (node.classList.contains(classe)) {
      node.style.display = shouldShow ? 'block' : 'none';
    }
  });
};
