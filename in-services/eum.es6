import { noop } from 'in-services/util/function';

export const ineum = typeof window !== 'undefined' && window.ineum ? window.ineum : noop;
