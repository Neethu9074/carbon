/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link, Typography } from '@instana/components';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';

export const succesFeedback = (
  setIsChangingRetention: any,
  locals: any,
  successTitle: string,
  setNotification?: any
) => {
  //200
  if (setNotification) {
    setNotification({ show: true, variant: 'success' });
  }
  setIsChangingRetention(false);
  addMessage(
    {
      type: 'info',
      icon: 'lib_help_error_info_outline',
      content: (
        <section data-testid="changeRetentionSuccessNotification" className={locals.toast}>
          <Typography variant="heading-200">{successTitle}</Typography>
        </section>
      ),
      timeout: 5000
    },
    'logsRetentionChanged'
  );
};

export const errorFeedback = (
  setIsChangingRetention: any,
  locals: any,
  errorTitle: string,
  errorMessage: string,
  contactSupportLink: string,
  setNotification?: any
) => {
  //400
  if (setNotification) {
    setNotification({ show: true, variant: 'failure' });
  }
  setIsChangingRetention(false);
  addMessage(
    {
      type: 'danger',
      icon: 'lib_help_error_info_outline',
      content: (
        <section data-testid="changeRetentionFailNotification" className={locals.toast}>
          <Typography variant="heading-200">{errorTitle}</Typography>
          <Typography variant="body-regular">{errorMessage}</Typography>
          <Link
            className={locals.newLine}
            href="https://www.ibm.com/docs/en/instana-observability/latest?topic=support"
          >
            {contactSupportLink}
          </Link>
        </section>
      ),
      timeout: 5000
    },
    'logsRetentionChanged'
  );
};
