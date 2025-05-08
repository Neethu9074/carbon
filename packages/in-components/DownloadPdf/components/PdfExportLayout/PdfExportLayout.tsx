/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

import PdfContent from 'in-components/DownloadPdf/components/PdfContent/PdfContent';
import PdfHeader from 'in-components/DownloadPdf/components/PdfHeader/PdfHeader';
import { pdfExportLayout } from 'in-components/DownloadPdf/utils/constants';

import locals from 'in-components/DownloadPdf/components/PdfExportLayout/PdfExportLayout.mless';

interface Props {
  onReady?: () => void;
  orientation?: string;
  isFullWidth?: boolean;
  pdfContent?: ReactNode;
}

const PdfExportLayout = forwardRef<HTMLDivElement, Props>(({ onReady, orientation, pdfContent, isFullWidth }, ref) => {
  return (
    <div
      id={pdfExportLayout}
      data-testid={pdfExportLayout}
      className={classNames({
        [locals.pdfExportLayout]: true,
        [locals.fullWidth]: isFullWidth,
        [locals.landscape]: Boolean(orientation === 'l')
      })}
    >
      <div id="pdf-export-container" ref={ref}>
        <PdfHeader orientation={orientation} />
        <PdfContent orientation={orientation} onReady={onReady}>
          {pdfContent}
        </PdfContent>
      </div>
    </div>
  );
});

export default PdfExportLayout;
