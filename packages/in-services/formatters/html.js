/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* global require:false */
/* global require:false, process:false */

import { create } from '@instana/observables';

let cachedPurifier;
let cachedAnsiConverter;

/**
 * This function replaces a set of commonly used HTML chars like <, > and & with
 * their escaped counterparts.
 *
 * THIS IS NOT SANITIZATION! DO NOT USE THIS TO "PROTECT" THE USER FROM XSS!
 * USE THE SANITIZE() FUNCTION FOR THESE CASES!
 *
 * Only use this function when you want to present XML like structures to the
 * user, e.g. Apache HTTPd configs. AND REMEMBER TO SANITIZE AFTERWARDS!
 */
export function replaceHtmlChars(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function sanitize(html) {
  return getLoadedPurifier().map(purifier => purifier.sanitize(html));
}

export function getLoadedPurifier() {
  const result = create();

  if (cachedPurifier) {
    result.emit(cachedPurifier);
  } else {
    if (process.env.IS_TEST) {
      cachedPurifier = require('./html_purifier.js');
      result.emit(cachedPurifier);
    } else {
      require(['./html_purifier.js'], function onModLoad(purifier) {
        cachedPurifier = purifier;
        result.emit(cachedPurifier);
      });
    }
  }

  return result;
}

export function ansiToHtml(ansi) {
  return getLoadedAnsiConverter().map(converter => converter.ansiToHtml(ansi));
}

export function getLoadedAnsiConverter() {
  const result = create();

  if (cachedAnsiConverter) {
    result.emit(cachedAnsiConverter);
  } else {
    if (process.env.IS_TEST) {
      cachedAnsiConverter = require('./html_ansi_converter.js');
      result.emit(cachedAnsiConverter);
    } else {
      require(['./html_ansi_converter.js'], function onModLoad(ansiConverter) {
        cachedAnsiConverter = ansiConverter;
        result.emit(cachedAnsiConverter);
      });
    }
  }

  return result;
}
