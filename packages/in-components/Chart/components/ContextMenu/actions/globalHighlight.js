import { setHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';

const config = {
  name: 'globalHighlight',
  icon: 'lib_views_tag',
  label: 'Highlight on all charts',
  onClick: onClick
};
export default config;

function onClick(highlightedTimeframe, clearLocalHighlightedTimeframe) {
  setHighlightedTimeframe(highlightedTimeframe[0], highlightedTimeframe[1]);
  clearLocalHighlightedTimeframe();
}
