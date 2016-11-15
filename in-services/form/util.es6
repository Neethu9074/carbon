// @flow

/*::
import type {Path, NormalizedPath, ValidationError} from 'in-services/form/types';
*/


export function alwaysValidValidator()/*: ValidationError*/ {
  return null;
}


export function normalizePath(path/*: Path*/)/*: NormalizedPath*/ {
  if (path instanceof Array) {
    return path;
  }
  return [path];
}


export function isLastPathElement(path/*: Path*/, i/*: number*/)/*: boolean*/ {
  return i === path.length - 1;
}


export function isPathExhausted(path/*: Path*/, i/*: number*/)/*: boolean*/ {
  return i >= path.length;
}
