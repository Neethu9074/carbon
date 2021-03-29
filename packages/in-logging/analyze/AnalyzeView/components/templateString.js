/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const PARAMETER = 'p';
export const MESSAGE_CHUNK = 'm';

export function toChunks(messageStr, parameters) {
  if (!messageStr || !parameters) {
    return [];
  }

  if (parameters.length === 0) {
    return [{ type: MESSAGE_CHUNK, value: messageStr }];
  }

  return createChunks(messageStr, parameters).filter(({ value }) => value);
}

function createChunks(messageStr, parameters) {
  const chunks = [];
  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i];
    const indexOfNextParam = messageStr.indexOf('{}');
    if (indexOfNextParam === -1) {
      chunks.push({ type: MESSAGE_CHUNK, value: messageStr });
      return chunks;
    }
    chunks.push({ type: MESSAGE_CHUNK, value: messageStr.substring(0, indexOfNextParam) });
    chunks.push({ type: PARAMETER, value: parameter });
    messageStr = messageStr.substring(indexOfNextParam + 2);
  }
  if (messageStr) {
    chunks.push({ type: MESSAGE_CHUNK, value: messageStr });
  }
  return chunks;
}
