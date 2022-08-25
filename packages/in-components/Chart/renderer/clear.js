/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default function clear(config) {
  config.backBufferCtx.clearRect(0, 0, config.backBufferWidth, config.height);
}
