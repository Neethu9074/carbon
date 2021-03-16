/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import theme from 'in-themes/active.json';

// Unfortunately a limitation in the grid library and an inconsistency
// to the rest of the product: rowHeightPixels must be a multiple of the
// the configured margin. Ideally we would like to use our standard margin
// of 24px while using a small row height so that end-users have a lot of
// flexibility. Unfortunately this doesn't work with the library. To
// compensate we diverge from and reduce our default size. This means
// flexibility for widgets at the cost of a small visual inconsistency.
//
// Also see the following issue in react-grid-layout
// https://github.com/STRML/react-grid-layout/issues/816
const sizing = theme.grid.gutter * 0.5;
export const margin = [sizing, sizing];
export const containerPadding = [0, 0];
export const rowHeightPixels = sizing;
export const breakpoints = { lg: 1920, md: 1680, sm: 1024, xs: 800, xxs: 0 };
export const cols = 12;
