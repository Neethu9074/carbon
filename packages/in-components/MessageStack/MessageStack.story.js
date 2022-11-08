/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {
  PLEASE_CONTACT_INSTANA_SUPPORT_ERROR_MSG_PHRASE,
  enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError
} from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { SmartAlertErrorMessages } from 'in-alerting/smart-alerts/components/smart-alert-dialog/components/SmartAlertErrorMessages';

export default {
  component: SmartAlertErrorMessages
};

export const Default = {
  args: {
    messages: [
      { message: 'warning 1', level: 'warning' },
      { message: 'error 1' },
      { message: 'warning 2', level: 'warning' },
      { message: 'error 2', level: 'error' }
    ]
  }
};

const dummyTestErrorMessageContainingAskSupport =
  'The maximum number of website alert configurations (9990000) has been reached. Please contact Instana support to request an increase for this limit.';

export const SmartAlertQuotaError = {
  args: {
    messages: [
      enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError({
        message: dummyTestErrorMessageContainingAskSupport
      }),
      {
        message: PLEASE_CONTACT_INSTANA_SUPPORT_ERROR_MSG_PHRASE,
        level: 'warning'
      }
    ]
  }
};
