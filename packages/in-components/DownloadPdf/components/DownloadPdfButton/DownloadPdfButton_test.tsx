/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import DownloadPdfButton from 'in-components/DownloadPdf/components/DownloadPdfButton/DownloadPdfButton';

const options = {
  pdfHeaderTitle: ''
};

test('renders DownloadPdfButton', () => {
  render(<DownloadPdfButton options={options} />);
  const element = screen.getByText('Download PDF');
  expect(element).toBeInTheDocument();
});
