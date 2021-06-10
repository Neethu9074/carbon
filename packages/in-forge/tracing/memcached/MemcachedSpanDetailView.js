/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function MemcacheSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.memcached.titleOperation')}>{span.getIn(['data', 'memcached', 'operation'])}</Di>
        <Di title={t('in-forge:tracing.memcached.titleKey')}>{span.getIn(['data', 'memcached', 'key'])}</Di>
        <Di title={t('in-forge:tracing.memcached.titleResultCode')}>
          {span.getIn(['data', 'memcached', 'resultCode'])}
        </Di>
        <Di title={t('in-forge:tracing.memcached.titleResultMessage')}>
          {span.getIn(['data', 'memcached', 'resultMessage'])}
        </Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'memcached', 'error'])} />
      </Dl>
    </div>
  );
}
