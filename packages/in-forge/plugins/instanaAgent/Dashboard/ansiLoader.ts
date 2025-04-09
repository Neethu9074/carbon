/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { create, Observable } from '@instana/observables';

let cachedAnsiConverter: any;

export function ansiToHtml(ansi: string): Observable<string> {
  return getLoadedAnsiConverter().map(converter => converter.ansiToHtml(ansi));
}

function getLoadedAnsiConverter(): Observable<any> {
  const result = create();

  if (cachedAnsiConverter) {
    result.emit(cachedAnsiConverter);
  } else {
    cachedAnsiConverter = require('./ansi.ts');
    result.emit(cachedAnsiConverter);
  }

  return result;
}
