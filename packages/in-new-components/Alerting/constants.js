import PropTypes from 'prop-types';

import { hours } from 'in-services/time';

export const alertingDialogItemPickerTimeframe = hours.toMillis(7 * 24);
export const alertingEventDetailsChartTimeframe = hours.toMillis(12);

export const blueprintConfigPropType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  getAllTagFilters: PropTypes.func.isRequired,
  disabledTagFilters: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  baselineEnabled: PropTypes.bool.isRequired,
  isCustomRateMetric: PropTypes.func.isRequired,
  getMetricsRequest: PropTypes.func.isRequired,
  getAlertsPreviewRequest: PropTypes.func.isRequired,
  getThresholdSuggestionRequest: PropTypes.func.isRequired,
  getMetricName: PropTypes.func.isRequired,
  getMetricLabel: PropTypes.func.isRequired,
  getMetricFormat: PropTypes.func.isRequired,
  getMaxMetricValue: PropTypes.func.isRequired,
  getAggregation: PropTypes.func.isRequired,
  isRuleComplete: PropTypes.func.isRequired,

  getRuleTagFilters: PropTypes.func.isRequired,
  getRuleTagFilterExpression: PropTypes.func.isRequired,

  getEntityTagFilter: PropTypes.func.isRequired,
  getEntityTagFilterExpression: PropTypes.func.isRequired,

  // the following are only needed when the blueprint has sub-types in simple-mode:
  subType: PropTypes.string,
  thresholdDefaults: PropTypes.object,
  isSelected: PropTypes.func
});
