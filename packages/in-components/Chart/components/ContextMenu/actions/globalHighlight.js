/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { setHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';

const config = {
  name: 'globalHighlight',
  icon: 'lib_views_tag',
  label: 'Highlight on all charts',
  onClick: onClick
};
export default config;

function onClick(highlightedTimeframe) {
  setHighlightedTimeframe(highlightedTimeframe[0], highlightedTimeframe[1]);
}
