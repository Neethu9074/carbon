/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import PdfContent from 'in-components/DownloadPdf/components/PdfContent/PdfContent';

test('renders PdfContent', () => {
  render(
    <PdfContent>
      <p>Content to be exported</p>
    </PdfContent>
  );
  const element = screen.getByTestId('pdf-content');
  expect(element).toBeInTheDocument();
});
