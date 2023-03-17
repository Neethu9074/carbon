/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';

/**
 * Resolves either a string link or an observable one to an object with either. Use in cases where links cannot be fully migrated from observables.
 **/
export default function unwrapLink(link?: string | Observable<string>) {
  let href;
  let href$;
  if (typeof link === 'string') href = link;
  else href$ = link;
  return { href, href$ };
}
