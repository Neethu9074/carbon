/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useCallback, useRef, ReactNode, useState } from 'react';
import { jsPDFOptions } from 'jspdf';

import { CtaTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { generateImageFromNode } from 'in-components/DownloadPdf/utils/generateImageFromNode';
import DOMNodeWrapper from 'in-components/DownloadPdf/utils/DOMNodeWrapper/DOMNodeWrapper';
import { DOWNLOAD_PDF_FINISH, DOWNLOAD_PDF_START } from 'in-services/tracking/tracking';
import PdfExportPortal from 'in-components/DownloadPdf/components/PdfExportPortal';
import { pdfContent, pdfHeader } from 'in-components/DownloadPdf/utils/constants';
import { getPdfHeader } from 'in-components/DownloadPdf/utils/getPdfHeader';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { imagesToPdf } from 'in-services/util/imagesToPdf';
import { t } from 'in-i18n';

export interface Options {
  filename?: string;
  pdfSettings?: jsPDFOptions;
  pdfHeaderTitle?: string;
  shouldFitPdf?: boolean;
  isPortalContentFullWidth?: boolean;
  customize?: (nodeToExport: HTMLElement) => void;
  sanitize?: (node: Node) => boolean;
}

interface ActionProps {
  portalNode: HTMLElement;
  pdfHeaderNode: HTMLElement;
  pdfContentNode: HTMLElement;
}

export default function usePdfExport() {
  const portalRef = useRef<HTMLDivElement>(null);
  const { trackCta } = useSegmentTracking();
  const [portal, setPortal] = useState<JSX.Element | null>(null);

  // Function that sets the portal and dispatches the onReady function when the portal is added.
  // It performs the action function provided.
  const renderPortal = useCallback(
    <T,>(
      Component: ReactNode,
      action: ({ portalNode, pdfHeaderNode, pdfContentNode }: ActionProps) => Promise<T>,
      options?: Options
    ): Promise<T> =>
      new Promise((resolve, reject) => {
        const onReady = async () => {
          try {
            const portalNode = portalRef.current;
            if (!portalNode) throw new Error('No portal found');
            const pdfHeaderNode = portalNode?.querySelector(`#${pdfHeader}`) as HTMLElement;
            const pdfContentNode = portalNode?.querySelector(`#${pdfContent}`) as HTMLElement;
            const result = await action({ portalNode, pdfHeaderNode, pdfContentNode });
            resolve(result);
          } catch (err) {
            reject(new Error(err as any));
          }
        };

        setPortal(
          <PdfExportPortal
            ref={portalRef}
            orientation={options?.pdfSettings?.orientation}
            pdfHeaderTitle={options?.pdfHeaderTitle}
            pdfContent={Component}
            isFullWidth={options?.isPortalContentFullWidth}
            onReady={onReady}
          />
        );
      }),
    []
  );

  /**
   * Function that mounts the portal and generates the pdf based on a component provided.
   */
  const generatePdfFromElement = (target: React.ReactNode, options: Options) => {
    const isNode = target instanceof HTMLElement;
    let component = target;

    // Clone node and canvas in case it's a node and wrapp in a container.
    if (isNode) {
      const clonedNode = target.cloneNode(true) as HTMLElement;
      cloneWithCanvasContents(target, clonedNode);
      component = <DOMNodeWrapper node={clonedNode} />;
    }

    renderPortal(
      component,
      async ({ pdfHeaderNode: node, pdfContentNode }) => {
        const { customize, shouldFitPdf = true } = options;
        const headerUrl = await getPdfHeader({ node });

        customize?.(pdfContentNode);
        notify({
          title: t(`in-components:downloadPdf.generatingPDFTitle`),
          content: t(`in-components:downloadPdf.generatingPDFContent`),
          action: 'generating'
        });

        // Generates an image if there are nodes to be exported and pdf header exists
        if (headerUrl) {
          trackCta?.(DOWNLOAD_PDF_START);
          generateImageFromNode({
            node: pdfContentNode,
            options: {
              filter: (child: Node) => options?.sanitize?.(child) ?? true
            }
          }).then(imageUrl => {
            const { filename, pdfSettings } = options;
            imagesToPdf({
              imageScale: 2,
              imagesUrls: [imageUrl],
              headerUrl,
              filename,
              shouldFitPdf,
              pdfSettings
            }).then(({ onfulfilled }) => handleSuccess({ onfulfilled, setPortal, trackCta }));
          });
        }
      },
      options
    );
  };

  /**
   * Function that mounts the portal and exports the dashboard to pdf.
   */
  const exportDashboardToPdf = (
    options: Options = { shouldFitPdf: false, isPortalContentFullWidth: true, filename: 'generated-instana-report' }
  ) => {
    const node = document.querySelector('.sticky-wrapper');
    generatePdfFromElement(node, {
      shouldFitPdf: false,
      isPortalContentFullWidth: true,
      ...options
    });
  };

  /**
   * Function that mounts the portal, generates the pdf header and returns its url.
   */
  const getPdfHeaderUrl = (options: Options) =>
    renderPortal(
      null,
      async ({ pdfHeaderNode }) => {
        const pdfHeaderUrl = await getPdfHeader({ node: pdfHeaderNode });
        setPortal(null);
        return pdfHeaderUrl;
      },
      options
    );

  return {
    generatePdfFromElement,
    exportDashboardToPdf,
    getPdfHeaderUrl,
    PdfExportRenderer: portal
  };
}

function notify({ title, content, action }: { title: string; content: string; action: string }) {
  addMessage(
    {
      type: 'info',
      timeout: 5000,
      title,
      content
    },
    `custom-dashboard-pdf-${action}`
  );
}

/**
 * Function that copies any canvas from original node to the cloned one.
 * It's necessary to render the canvas in the pdf.
 */
function cloneWithCanvasContents(original: HTMLElement, clone: HTMLElement) {
  const origCanvases = original.querySelectorAll('canvas');
  const cloneCanvases = clone.querySelectorAll('canvas');
  origCanvases.forEach((origCanvas: HTMLCanvasElement, i: number) => {
    const cloneCanvas = cloneCanvases[i];
    cloneCanvas.width = origCanvas.width;
    cloneCanvas.height = origCanvas.height;
    const ctx = cloneCanvas.getContext('2d');
    ctx?.drawImage(origCanvas, 0, 0);
    cloneCanvas.style.width = '100%';
    cloneCanvas.style.height = 'auto';
    cloneCanvas.style.display = 'block';
  });
  return clone;
}

interface Props {
  onfulfilled: boolean;
  setPortal: React.Dispatch<React.SetStateAction<JSX.Element | null>>;
  trackCta: CtaTrackingFunction;
}

function handleSuccess({ onfulfilled, setPortal, trackCta }: Props) {
  if (!onfulfilled) {
    return;
  }
  notify({
    title: t(`in-components:downloadPdf.generatedPDFTitle`),
    content: t(`in-components:downloadPdf.generatedPDFContent`),
    action: 'generated'
  });
  setPortal(null);
  trackCta?.(DOWNLOAD_PDF_FINISH);
}
