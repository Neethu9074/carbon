/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function BatchSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.sdkBatch.job')}>{span.getIn(['data', 'batch', 'job'])}</Di>
      </Dl>
    </div>
  );
}
