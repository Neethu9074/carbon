/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export function buildMaskedToken(token) {
  return token.substring(0, 4) + '********************';
}
