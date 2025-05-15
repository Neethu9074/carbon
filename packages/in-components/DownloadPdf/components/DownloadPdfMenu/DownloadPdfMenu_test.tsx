/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import DownloadPdfMenu from 'in-components/DownloadPdf/components/DownloadPdfMenu/DownloadPdfMenu';

jest.mock('in-services/featureFlags', () => ({
  infraDashboardExportPdfEnabled: true
}));

test('renders DownloadPdfButton', () => {
  render(<DownloadPdfMenu />);

  const element = screen.getByTestId('download-pdf-menu');
  expect(element).toBeInTheDocument();
});
