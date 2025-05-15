/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

export default function excludeDataNoPdf(node: Node) {
  if (node instanceof HTMLElement) {
    return !node.hasAttribute('data-no-pdf');
  }
  return true;
}
