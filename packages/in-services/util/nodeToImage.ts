/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import domtoimage, { Options } from 'dom-to-image';

export interface NodeToImageProps {
  node: HTMLElement;
  format: string;
  scale?: number;
  options?: Options;
}

export const nodeToImage = ({ node, format = 'png', scale = 2, options }: NodeToImageProps): Promise<string> => {
  const isPng = format.toLowerCase() === 'png';
  const props = {
    width: node.clientWidth * scale,
    height: node.clientHeight * scale,
    style: {
      transform: 'scale(' + scale + ')',
      'transform-origin': 'top left'
    },
    ...options
  };

  const imageUrl = isPng ? domtoimage.toPng(node, props) : domtoimage.toJpeg(node, props);

  return imageUrl;
};
