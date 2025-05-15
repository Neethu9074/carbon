/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MoreMenu, MoreMenuButton } from '@instana/components';

import { infraDashboardExportPdfEnabled } from 'in-services/featureFlags';
import usePdfExport from 'in-components/DownloadPdf/hooks/usePdfExport';
import { t } from 'in-i18n';

export default function DownloadPdfMenu() {
  const { exportDashboardToPdf, PdfExportRenderer } = usePdfExport();

  if (!infraDashboardExportPdfEnabled) {
    return null;
  }

  return (
    <>
      <MoreMenu data-testid="download-pdf-menu" size="compact">
        <MoreMenuButton icon="lib_actions_download" onClick={() => exportDashboardToPdf()}>
          {t('in-components:downloadPdf.downloadPdfLabel')}
        </MoreMenuButton>
      </MoreMenu>
      {PdfExportRenderer}
    </>
  );
}
