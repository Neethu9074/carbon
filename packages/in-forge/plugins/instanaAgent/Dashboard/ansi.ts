/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Convert from 'ansi-to-html';

export function ansiToHtml(ansi: string): string {
  return new Convert().toHtml(ansi);
}
