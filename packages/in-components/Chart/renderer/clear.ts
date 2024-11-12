/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { RenderConfig } from 'in-components/Chart/renderer/types';

export default function clear(config: RenderConfig) {
  config.backBufferCtx.clearRect(0, 0, config.backBufferWidth ? config.backBufferWidth : 0, config.height);
}
