/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { setHighlightedTimeframe } from 'in-stores/highlightedTimeframe';
import { t } from 'in-i18n';

const config = {
  name: 'globalHighlight',
  icon: 'lib_views_tag',
  label: t('in-components:chart.chartGlobalHighlightLabel'),
  onClick: onClick
};
export default config;

function onClick(highlightedTimeframe: [number, number]) {
  setHighlightedTimeframe(highlightedTimeframe[0], highlightedTimeframe[1]);
}
