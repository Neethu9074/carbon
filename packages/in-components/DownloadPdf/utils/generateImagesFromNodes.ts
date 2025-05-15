/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { generateImageFromNode } from 'in-components/DownloadPdf/utils/generateImageFromNode';
import { ActionsTypes, PdfAction } from 'in-components/DownloadPdf/DownloadPdfDialog/reducer';
import { baseSanitizeNode } from 'in-components/DownloadPdf/utils/baseSanitizeNode';
import excludeDataNoPdf from 'in-components/DownloadPdf/utils/excludeDataNoPdf';
import { t } from 'in-i18n';

/**
 * Function that generates images from an array of nodes.
 * It returns an array of images urls.
 */
export async function generateImagesFromNodes(
  nodes: HTMLElement[],
  setIsGenerating: ActionsTypes,
  dispatch: React.Dispatch<PdfAction>,
  sanitize?: (node: Node) => boolean
) {
  const combinedFilter = (node: Node) => baseSanitizeNode(node) && excludeDataNoPdf(node) && (sanitize?.(node) ?? true);
  const images = [];
  for (let [i, node] of nodes.entries()) {
    try {
      const image = await generateImageFromNode({
        node,
        options: {
          filter: combinedFilter
        }
      });
      dispatch({
        type: setIsGenerating,
        payload: {
          value: true,
          text: t('in-components:downloadPdf.loadingWidget', {
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
