/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Convert from 'ansi-to-html';

export function ansiToHtml(ansi) {
  return new Convert().toHtml(ansi);
}
