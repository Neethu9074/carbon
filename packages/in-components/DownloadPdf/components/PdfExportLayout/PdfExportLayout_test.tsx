/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import PdfExportLayout from 'in-components/DownloadPdf/components/PdfExportLayout/PdfExportLayout';

test('renders PdfExportLayout', () => {
  render(<PdfExportLayout />);
  const element = screen.getByTestId('pdf-export-layout');
  expect(element).toBeInTheDocument();
});
