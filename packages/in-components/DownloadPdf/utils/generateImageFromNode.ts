/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Options } from 'dom-to-image';

import { baseSanitizeNode } from 'in-components/DownloadPdf/utils/baseSanitizeNode';
import { nodeToImage } from 'in-services/util/nodeToImage';

interface Props {
  node: HTMLElement;
  format?: string;
  options?: Options;
}
/**
 * Function that generates an image from a node.
 * It passes already a default sanitize function.
 * It returns the image url.
 */
export function generateImageFromNode({ node, format, options }: Props): Promise<string> {
  const combinedFilter = (node: Node) => baseSanitizeNode(node) && (options?.filter?.(node) ?? true);
  return nodeToImage({
    node,
    format,
    options: {
      ...options,
      filter: combinedFilter
    }
  });
}
