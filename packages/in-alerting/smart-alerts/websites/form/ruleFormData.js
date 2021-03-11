/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { operators } from 'in-analyze/applicationFilter';
import { t } from 'in-i18n';

export const ruleJsErrorsOperatorOptions = Object.freeze([
  { value: operators.NOT_EMPTY, label: t('in-alerting:smartAlerts.websites.form.ruleJsErrorsOperatorOptionAny') },
  { value: operators.EQUALS, label: t('in-alerting:smartAlerts.websites.form.ruleJsErrorsOperatorOptionEquals') },
  { value: operators.CONTAINS, label: t('in-alerting:smartAlerts.websites.form.ruleJsErrorsOperatorOptionContains') },
  {
    value: operators.STARTS_WITH,
    label: t('in-alerting:smartAlerts.websites.form.ruleJsErrorsOperatorOptionStartsWith')
  },
  { value: operators.ENDS_WITH, label: t('in-alerting:smartAlerts.websites.form.ruleJsErrorsOperatorOptionEndWith') }
]);

export const ruleStatusCodeValueOptions = Object.freeze([
  { value: '1', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption1') },
  { value: '100', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption100') },
  { value: '101', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption101') },
  { value: '102', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption102') },
  { value: '103', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption103') },
  { value: '2', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption2') },
  { value: '200', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption200') },
  { value: '201', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption201') },
  { value: '202', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption202') },
  { value: '203', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption203') },
  { value: '204', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption204') },
  { value: '205', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption205') },
  { value: '206', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption206') },
  { value: '207', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption207') },
  { value: '208', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption208') },
  { value: '226', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption226') },
  { value: '3', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption3') },
  { value: '300', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption300') },
  { value: '301', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption301') },
  { value: '302', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption302') },
  { value: '303', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption303') },
  { value: '304', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption304') },
  { value: '305', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption305') },
  { value: '306', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption306') },
  { value: '307', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption307') },
  { value: '308', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption308') },
  { value: '4', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption4') },
  { value: '400', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption400') },
  { value: '401', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption401') },
  { value: '402', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption402') },
  { value: '403', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption403') },
  { value: '404', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption404') },
  { value: '405', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption405') },
  { value: '406', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption406') },
  { value: '407', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption407') },
  { value: '408', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption408') },
  { value: '409', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption409') },
  { value: '410', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption410') },
  { value: '411', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption411') },
  { value: '412', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption412') },
  { value: '413', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption413') },
  { value: '414', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption414') },
  { value: '415', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption415') },
  { value: '416', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption416') },
  { value: '417', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption417') },
  { value: '418', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption418') },
  { value: '421', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption421') },
  { value: '422', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption422') },
  { value: '423', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption423') },
  { value: '424', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption424') },
  { value: '426', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption426') },
  { value: '428', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption428') },
  { value: '429', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption429') },
  { value: '431', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption431') },
  { value: '444', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption444') },
  { value: '451', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption451') },
  { value: '499', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption499') },
  { value: '5', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption5') },
  { value: '500', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption500') },
  { value: '501', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption501') },
  { value: '502', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption502') },
  { value: '503', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption503') },
  { value: '504', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption504') },
  { value: '505', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption505') },
  { value: '506', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption506') },
  { value: '507', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption507') },
  { value: '508', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption508') },
  { value: '510', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption510') },
  { value: '511', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption511') },
  { value: '599', label: t('in-alerting:smartAlerts.websites.form.ruleStatusCodeValueOption599') }
]);

export const ruleMetricNameOptions = Object.freeze({
  specificJsError: [
    { value: 'errors', label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionSpecificJsErrorErrors') },
    {
      value: 'specificJsErrorRate',
      label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionSpecificJsErrorSpecificJsErrorRate')
    }
  ],
  statusCode: [
    { value: 'httpxxx', label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionStatusCodeHttpxxx') },
    {
      value: 'specificStatusCodeRate',
      label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionStatusCodeSpecificStatusCodeRate')
    }
  ],
  slowness: [
    { value: 'onLoadTime', label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionSlownessOnLoadTime') }
  ],
  throughput: [
    { value: 'pageLoads', label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionThroughputPageLoads') },
    {
      value: 'pageTransitions',
      label: t('in-alerting:smartAlerts.websites.form.ruleMetricNameOptionThroughputPageTransitions')
    }
  ]
});

export const ruleAggregationOptions = Object.freeze([
  { value: 'MEAN', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationOptionMEAN') },
  { value: 'MIN', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationOptionMIN') },
  { value: 'P25', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationOptionP25') },
  { value: 'P50', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationOptionP50') },
  { value: 'P75', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationOptionP75') },
  { value: 'P90', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationOptionP90') },
  { value: 'P95', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationOptionP95') },
  { value: 'P98', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationOptionP98') },
  { value: 'P99', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationOptionP99') },
  { value: 'MAX', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationOptionMAX') }
]);

export const ruleAggregationForWeeklySeasonalityOptions = Object.freeze([
  { value: 'MEAN', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationForWeeklySeasonalityOptionMEAN') },
  { value: 'P50', label: t('in-alerting:smartAlerts.websites.form.ruleAggregationForWeeklySeasonalityOptionP50') }
]);

export function getStatusCodeLabel(value) {
  return ruleStatusCodeValueOptions.filter(entry => entry.value === value)[0].label;
}

export function getRuleOperatorLabel(value) {
  return ruleJsErrorsOperatorOptions.filter(entry => entry.value === value)[0].label;
}
