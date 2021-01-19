/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { create } from '@instana/observables';

export function onImageLoad(url) {
  const result = create();

  const img = new Image();
  img.onload = () => result.emit(url);
  img.src = url;

  return result;
}
