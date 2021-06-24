/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* global require:false, process:false */

import { create } from '@instana/observables';

let cachedAnsiConverter;

export function ansiToHtml(ansi) {
  return getLoadedAnsiConverter().map(converter => converter.ansiToHtml(ansi));
}

export function getLoadedAnsiConverter() {
  const result = create();

  if (cachedAnsiConverter) {
    result.emit(cachedAnsiConverter);
  } else {
    if (process.env.IS_TEST) {
      cachedAnsiConverter = require('./ansi.js');
      result.emit(cachedAnsiConverter);
    } else {
      require(['./ansi.js'], function onModLoad(ansiConverter) {
        cachedAnsiConverter = ansiConverter;
        result.emit(cachedAnsiConverter);
      });
    }
  }

  return result;
}
