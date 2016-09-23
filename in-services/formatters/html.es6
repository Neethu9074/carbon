/* global require:false */

import {create} from 'reactive-observables';

let cachedPurifier;
let cachedAnsiConverter;


export function sanitize(html) {
  return getLoadedPurifier().map(purifier => purifier.sanitize(html));
}


export function getLoadedPurifier() {
  const result = create();

  if (cachedPurifier) {
    result.emit(cachedPurifier);
  } else {
    require(['./html_purifier.es6'], function onModLoad(purifier) {
      cachedPurifier = purifier;
      result.emit(cachedPurifier);
    });
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
    require(['./html_ansi_converter.es6'], function onModLoad(ansiConverter) {
      cachedAnsiConverter = ansiConverter;
      result.emit(cachedAnsiConverter);
    });
  }

  return result;
}
