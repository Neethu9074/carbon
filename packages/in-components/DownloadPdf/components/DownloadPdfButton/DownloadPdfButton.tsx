/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button } from '@instana/components';

import usePdfExport, { Options } from 'in-components/DownloadPdf/hooks/usePdfExport';
import { t } from 'in-i18n';

import locals from './DownloadPdfButton.mless';

export default function DownloadPdfButton({ options }: { options: Options }) {
  const { exportDashboardToPdf, PdfExportRenderer } = usePdfExport();
  return (
    <>
      <Button
        className={locals.downloadPdfButton}
        onClick={() => exportDashboardToPdf(options)}
        size="compact"
        icon="lib_actions_download"
        kind="secondary"
      >
        {t('in-components:downloadPdf.downloadPdfLabel')}
      </Button>
      {PdfExportRenderer}
    </>
  );
}
