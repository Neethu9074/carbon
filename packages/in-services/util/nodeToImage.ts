/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import domtoimage, { Options } from 'dom-to-image';

import { isSafari } from 'in-services/browser';

export interface NodeToImageProps {
  node: HTMLElement;
  format?: string;
  scale?: number;
  options?: Options;
}

export const nodeToImage = ({ node, format = 'png', scale = 2, options }: NodeToImageProps): Promise<string> => {
  const isPng = format.toLowerCase() === 'png';
  const hasCanvas = node?.querySelector('canvas') !== null;
  const generateImage = isPng ? domtoimage.toPng : domtoimage.toJpeg;

  const props = {
    width: node?.clientWidth * scale,
    height: node?.clientHeight * scale,
    style: {
      transform: 'scale(' + scale + ')',
      transformOrigin: 'top left'
    },
    ...options
  };

  // Safari has some issues when rendering canvas.
  // It's necessary to call the function generation twice, to make sure the canvas will be properly rendered.
  if (isSafari() && hasCanvas) {
    return generateImage(node, props).then(() => generateImage(node, props));
  }

  return generateImage(node, props);
};
