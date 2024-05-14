/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';


import { Typography } from '@instana/components';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';


export const succesFeedback = (setNotification:any, setIsChangingRetention:any, locals:any, localisationStrings:any) => {
  //200
    setNotification({ show: true, variant: 'success' });
    setIsChangingRetention(false);
    addMessage(
      {
        type: 'info',
        icon: 'lib_help_error_info_outline',
        content: (
          <section className={locals.toast}>
            <Typography variant="heading-200">{localisationStrings.toastTitleSuccesful}</Typography>
            <Typography variant="body-regular">{localisationStrings.toastMessageSuccesful}</Typography>
          </section>
        ),
        timeout: 5000
      },
      'logsRetentionChanged'
    );
  };

  export const errorFeedback = (setNotification:any, setIsChangingRetention:any, locals:any, localisationStrings:any) => {
    //400
    setNotification({ show: true, variant: 'failure' });
    setIsChangingRetention(false);
    addMessage(
      {
        type: 'danger',
        icon: 'lib_help_error_info_outline',
        content: (
          <section className={locals.toast}>
            <Typography variant="heading-200">{localisationStrings.toastTitleFailed}</Typography>
            <Typography variant="body-regular">{localisationStrings.toastMessageFailed}</Typography>
          </section>
        ),
        timeout: 5000
      },
      'logsRetentionChanged'
    );
  }
  