/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';

import { hours } from 'in-services/time';

export const alertingDialogItemPickerTimeframe = hours.toMillis(7 * 24);
export const alertingEventDetailsChartTimeframe = hours.toMillis(12);

export const blueprintConfigPropType = PropTypes.shape({
  type: PropTypes.string.isRequired,
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

  /**
   * Smart Alert rule specific filters in QB1 format.
   */
  getRuleTagFilters: PropTypes.func.isRequired,
  /**
   * Smart Alert rule specific filters in QB2 FormModel format.
   */
  getRuleTagFilterFormModel: PropTypes.func.isRequired,

  /**
   * Smart Alert entity related filter in QB1 format.
   */
  getEntityTagFilters: PropTypes.func.isRequired,
  /**
   * Smart Alert entity related filters in QB2 FormModel format.
   */
  getEntityTagFilterFormModel: PropTypes.func.isRequired,

  /**
   * Additional filters of a Smart Alert that only needs to be applied in Unbound Analytics, using QB2 FormModel format.
   */
  getExtraAnalyzeLinkTagFilterFormModel: PropTypes.func.isRequired,

  // the following are only needed when the blueprint has sub-types in simple-mode:
  subType: PropTypes.string,
  thresholdDefaults: PropTypes.object,
  isSelected: PropTypes.func
});
