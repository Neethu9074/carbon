/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/*
 * Hard coded colors that are only used in the infrastructure map, so they are
 * defined here only.
 *
 * Don't use them on other places.
 */

export const strokeColors = [
  '#5da6da',
  '#61bd68',
  '#decf3f',
  '#c39eff',
  '#ff57a8',
  '#ff9800',
  '#d03035',
  '#d0e035',
  '#9999cc',
  '#965742'
] as const;

export const cubeColorFalloffValues = {
  right: { r: 0.78, g: 0.84, b: 0.87 },
  top: { r: 0.957, g: 0.97, b: 0.98 }
} as const;
