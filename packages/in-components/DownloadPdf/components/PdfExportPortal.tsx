/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, forwardRef, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import PdfExportLayout from 'in-components/DownloadPdf/components/PdfExportLayout/PdfExportLayout';

interface Props {
  onReady: () => void;
  orientation?: string;
  pdfHeaderTitle?: string;
  pdfContent?: ReactNode;
  isFullWidth?: boolean;
}

const PdfExportPortal = forwardRef<HTMLDivElement, Props>(
  ({ onReady, orientation, pdfHeaderTitle, pdfContent, isFullWidth }, ref) => {
    const [container] = useState(() => document.createElement('div'));
    const [mounted, setMounted] = useState(false);

    // Creates a container to append the portal on the fly
    // Remove it after unmounting the component
    useEffect(() => {
      document.body.appendChild(container);
      setMounted(true);
      return () => {
        document.body.removeChild(container);
      };
    }, [container]);

    return mounted
      ? createPortal(
          <PdfExportLayout
            ref={ref}
            pdfHeaderTitle={pdfHeaderTitle}
            pdfContent={pdfContent}
            orientation={orientation}
            onReady={onReady}
            isFullWidth={isFullWidth}
          />,
          container
        )
      : null;
  }
);

PdfExportPortal.displayName = 'PdfExportPortal';

export default PdfExportPortal;
