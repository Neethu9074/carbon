/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export default function toPx(v) {
  // handle cases where the DOM style attribute is translating negative to
  // positive pixel values, e.g. left: -10px is translated to left: 10px.
  if (v < 0) return '0px';
  return (v | 0) + 'px';
}
