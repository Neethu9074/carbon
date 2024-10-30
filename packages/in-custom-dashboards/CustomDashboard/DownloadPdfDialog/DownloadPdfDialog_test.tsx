/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';
import React from 'react';

import DownloadPdfDialog from 'in-custom-dashboards/CustomDashboard/DownloadPdfDialog/DownloadPdfDialog';

jest.mock('jspdf');
jest.mock('dom-to-image');

const pdfSettings = {
  filter: expect.any(Function),
  height: expect.any(Number),
  width: expect.any(Number),
  style: {
    transform: 'scale(2)',
    transformOrigin: 'top left'
  }
};

describe('DownloadPdfDialog Component', () => {
  const mockNode = document.createElement('div');
  mockNode.innerHTML = '<div>Pdf content</div>';

  let mockPdfInstance: any;

  beforeEach(() => {
    mockPdfInstance = {
      addPage: jest.fn(),
      save: jest.fn()
    };

    // @ts-expect-error
    jsPDF.mockImplementation(() => mockPdfInstance);

    // @ts-expect-error
    domtoimage.toPng.mockResolvedValue('mocked-url');
  });

  it('should generate pdf in landscape mode', async () => {
    const { getByText } = render(<DownloadPdfDialog customDashboardId="test-pdf" node={mockNode} close={() => {}} />);

    // Click to generate preview
    fireEvent.click(getByText('Generate Preview'));

    await waitFor(() => {
      expect(jsPDF).toHaveBeenCalledTimes(1);
      expect(jsPDF).toHaveBeenCalledWith(expect.objectContaining({ orientation: 'landscape' }));
      expect(domtoimage.toPng).toHaveBeenCalledWith(mockNode, pdfSettings);
    });
  });

  it('should generate pdf in portrait mode', async () => {
    const { getByText } = render(<DownloadPdfDialog customDashboardId="test-pdf" node={mockNode} close={() => {}} />);

    // Click to change to portrait mode
    fireEvent.click(getByText('Portrait'));

    // Click to generate preview
    fireEvent.click(getByText('Generate Preview'));

    await waitFor(() => {
      expect(jsPDF).toHaveBeenCalledTimes(2);
      expect(jsPDF).toHaveBeenCalledWith(expect.objectContaining({ orientation: 'portrait' }));
      expect(domtoimage.toPng).toHaveBeenCalledWith(mockNode, pdfSettings);
    });
  });
});
