import { noop as _noop } from 'in-services/util/function';

export const emptyObject = Object.freeze({});
export const emptyJsMap = new Map();
export const emptyArray = Object.freeze([]);
export const javaLongMaxValue = 9223372036854775807;
export const noop = _noop;
