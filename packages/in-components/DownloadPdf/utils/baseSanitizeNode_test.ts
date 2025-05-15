/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { baseSanitizeNode } from 'in-components/DownloadPdf/utils/baseSanitizeNode';

describe('baseSanitizeNode', () => {
  it('should set href to # for <a> elements', () => {
    const a = document.createElement('a');
    a.href = 'https://ibm.com';

    const result = baseSanitizeNode(a);

    expect(result).toBe(true);
    expect(a.getAttribute('href')).toBe('#');
  });

  it('should remove inline styles from first child of .sticky-wrapper and set padding to 0', () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'sticky-wrapper';

    const child = document.createElement('div');
    child.setAttribute('style', 'padding-top: 200px;');
    wrapper.appendChild(child);

    const result = baseSanitizeNode(wrapper);

    expect(result).toBe(true);
    expect(wrapper.style.padding).toBe('0px');
    expect(child.getAttribute('style')).toBeNull();
  });
});
