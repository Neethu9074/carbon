/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import AdaptiveBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/AdaptiveBaselineErrorMessage';
import { AdaptiveBaselineSuggestionResponse } from 'in-types';
import { error, success } from 'in-services/util/result';

export default { component: AdaptiveBaselineErrorMessage };

export const Empty = { args: {} };

export const NoError = { args: { thresholdResult: success({}) } };

export const WithError = {
  args: {
    thresholdResult: error([
      {
        code: 'TIMEOUT',
        message: 'Could not fetch metrics: Metric request returned errors.'
      }
    ])
  }
};

export const WithInfo = {
  args: {
    thresholdResult: success({
      message: 'any information from backend'
    } as AdaptiveBaselineSuggestionResponse)
  }
};
