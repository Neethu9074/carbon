/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { generateImageFromNode } from 'in-components/DownloadPdf/utils/generateImageFromNode';

interface Props {
  node?: HTMLElement;
}

/**
 * Function that generates the pdf header and return its url.
 */
export async function getPdfHeader({ node }: Props) {
  if (!node) {
    return null;
  }

  return await generateImageFromNode({
    node,
    format: 'jpeg',
    options: {
      bgcolor: 'white'
    }
  }).then(headerUrl => headerUrl);
}
