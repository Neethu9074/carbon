/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { HorizontalIndicator, Message } from '@instana/components';
import { t } from '@instana/i18n-react';

import locals from './LoadingCallDetails.mless';

export default function LoadingCallDetails({ progress }) {
  return (
    <>
      <HorizontalIndicator progress={progress} />
      <Message type="neutral" small className={locals.message}>
        {t('in-analyze:traceDetail.components.callDetails.loading', 'Loading call details.')}
      </Message>
    </>
  );
}
