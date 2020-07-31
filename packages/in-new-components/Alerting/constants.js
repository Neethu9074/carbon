import { hoursToMillis } from 'in-new-components/Alerting/utils/formatUtils';
import PropTypes from 'prop-types';

export const alertingDialogItemPickerTimeframe = hoursToMillis(7 * 24);
export const alertingEventDetailsChartTimeframe = hoursToMillis(12);

export const blueprintConfigPropType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  blacklistedTagFilters: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  name: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
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
  getEntityTagFilter: PropTypes.func.isRequired,
  // the following are only needed when the blueprint has sub-types in simple-mode:
  subType: PropTypes.string,
  thresholdDefaults: PropTypes.object,
  isSelected: PropTypes.func
});
