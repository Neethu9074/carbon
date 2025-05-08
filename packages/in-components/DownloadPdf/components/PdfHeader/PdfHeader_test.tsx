/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import PdfHeader from 'in-components/DownloadPdf/components/PdfHeader/PdfHeader';

test('renders PdfHeader', () => {
  render(<PdfHeader />);
  const element = screen.getByTestId('pdf-header');
  expect(element).toBeInTheDocument();
});
