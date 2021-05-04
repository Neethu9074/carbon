/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const FAKE_ROOT_ID = 'fake_root';

export function isFakeRootCall(call) {
  return call.id === FAKE_ROOT_ID;
}

export function hasOnlyExitSpan(call) {
  return call.spans && call.spans.length == 1 && call.spans[0].kind == 'EXIT';
}

export function isUnknownTypeSpan(call) {
  return call.kind === 'UNKNOWN';
}

export function isInternalCall(call) {
  return call.endpoint.type === 'INTERNAL';
}

export function isLog(call) {
  return call.model === 'LOG';
}
