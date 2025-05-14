/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

/*
 *The values of these constants must be the same as the tag names defined in
 * synthetics-shared SyntheticTestResultTag (SyntheticResultClickHouseConstant)
 */
export const testResultIdTagName = 'synthetic.id';
export const testIdTagName = 'synthetic.testId';
export const testNameTagName = 'synthetic.testName';
export const locationIdTagName = 'synthetic.locationId';
export const applicationIdTagName = 'synthetic.applicationId';
export const websiteIdTagName = 'synthetic.websiteId';
export const mobileAppIdTagName = 'synthetic.mobileApplicationId';
export const serviceIdTagName = 'synthetic.serviceId';
export const runTypeTagName = 'synthetic.runType';
export const typeTagName = 'synthetic.syntheticType';
export const startTimeTagName = 'synthetic.startTime';
export const finishTimeTagName = 'synthetic.finishTime';
export const statusTagName = 'synthetic.metricsStatus';
export const locationTypeTagName = 'synthetic.locationType';
// Field obtained from GK Location through a temp table join
export const locationNameTagName = 'synthetic.locationName';
export const locationLabelTagName = 'synthetic.locationLabel';

/*
Will assign the following names when needed
  'synthetic.metricsBlocking',
  'synthetic.metricsDns',
  'synthetic.metricsConnect',
  'synthetic.metricsSsl',
  'synthetic.metricsSending',
  'synthetic.metricsWaiting',
  'synthetic.metricsReceiving',
  'synthetic.metricsResponseTime',
  'synthetic.metricsStatusCode',
  'synthetic.metricsHttpOperation',
  'synthetic.metricsContentType',
  'synthetic.metricsRequestSize',
  'synthetic.metricsResponseSize',
  'synthetic.metricsUploadSpeed',
  'synthetic.metricsDownloadSpeed',
  'synthetic.metricsRedirectTime',
  'synthetic.metricsRedirectCount',
  'synthetic.metricsConnectCount',

  'synthetic.metricsUri',
  'synthetic.metricsRetries',
  'synthetic.errors',
  'synthetic.tags',
  'synthetic.retainedUntilTimestamp',
  'synthetic.detailDataRef',
  */
