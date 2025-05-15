/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import excludeDataNoPdf from 'in-components/DownloadPdf/utils/excludeDataNoPdf';

// Tests for the function that is used to filter out elements that should be excluded from the pdf generation
describe('excludeDataNoPdf', () => {
  it('should return false if HTMLElement has data-no-pdf attribute', () => {
    const element = document.createElement('div');
    element.setAttribute('data-no-pdf', '');
    expect(excludeDataNoPdf(element)).toBe(false);
  });

  it('should return true if HTMLElement does not have data-no-pdf attribute', () => {
    const element = document.createElement('div');
    expect(excludeDataNoPdf(element)).toBe(true);
  });

  it('should return true for non-HTMLElement nodes', () => {
    const textNode = document.createTextNode('IBM Instana');
    expect(excludeDataNoPdf(textNode)).toBe(true);
  });
});
