/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function MessagingSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.sdkMessaging.destination')}>
          {span.getIn(['data', 'messaging', 'destination'])}
        </Di>
      </Dl>
    </div>
  );
}
