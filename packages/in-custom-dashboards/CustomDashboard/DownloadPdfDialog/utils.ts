/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ActionsTypes, PdfAction } from 'in-custom-dashboards/CustomDashboard/DownloadPdfDialog/reducer';
import { nodeToImage } from 'in-services/util/nodeToImage';
import { t } from 'in-i18n';

export const filterExcludedNodes = (node: Node) => {
  if (!(node instanceof HTMLElement)) {
    return true;
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
  for (const [index, node] of nodes.entries()) {
    try {
      const image = await nodeToImage({
        node,
        options: {
          filter: filterExcludedNodes
        }
      });
      dispatch({
        type: setIsGenerating,
        payload: {
          value: true,
          text: t('in-custom-dashboards:customDashboard.downloadPdfDialog.loadingWidget', {
            widgetIndex: index + 1,
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
