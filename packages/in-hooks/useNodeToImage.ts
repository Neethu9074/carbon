/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fromPromise } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { NodeToImageProps } from 'in-services/util/nodeToImage';
import { nodeToImage } from 'in-services/util/nodeToImage';

export default function useNodeToImage({ node, format = 'png', scale = 2, options }: NodeToImageProps) {
  return useObservable(() => {
    return fromPromise(nodeToImage({ node, format, scale, options }));
  }, []);
}
