/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/**
 * Function to sanitize and apply changes to nodes.
 * It transforms the nodes to generate the images that will be placed in the pdf.
 */
export const baseSanitizeNode = (node: Node): boolean => {
  // If node is <a> and has href, set the href to # to avoid breaking the transformation.
  if (node instanceof HTMLElement && node.tagName === 'A') {
    node.setAttribute('href', '#');
  }
  return true;
};
